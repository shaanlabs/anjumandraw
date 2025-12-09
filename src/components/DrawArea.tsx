import { useEffect, useState } from 'react';
import { useDrawContext } from '../context/DrawContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy } from 'lucide-react';
import RadarLockPhase from './phases/RadarLockPhase';
import FlightHUDPhase from './phases/FlightHUDPhase';
import FlightRadarPhase from './phases/FlightRadarPhase';

const DrawArea = () => {
    const { settings, currentWinner, drawStatus, currentPhase, completePhase, countdownValue, winners } = useDrawContext();
    const [displayNumber, setDisplayNumber] = useState<number>(settings.ticketStart);
    const [suspenseMessage, setSuspenseMessage] = useState<string>('');

    // Calculate reverse prize number
    const currentPrizeNumber = currentWinner ? currentWinner.prizeNumber : (settings.numberOfPrizes - winners.length);
    const remainingPrizes = settings.numberOfPrizes - winners.length;
    const isFirstPrize = currentPrizeNumber === 1;

    // ENHANCED DRAMATIC ROLLING ANIMATION with MORE fake stops
    useEffect(() => {
        if (drawStatus === 'drawing') {
            let frame = 0;
            const duration = isFirstPrize ? 15000 : 8000;
            const totalFrames = duration / 50;

            const fakeStops = isFirstPrize
                ? [totalFrames * 0.25, totalFrames * 0.45, totalFrames * 0.65, totalFrames * 0.85]
                : [totalFrames * 0.35, totalFrames * 0.65, totalFrames * 0.88];

            const suspenseMessages = [
                '😱 Wait for it...',
                '🎯 Getting close...',
                '⚡ Almost there...',
                '🔥 Final moment...',
                '💫 Here it comes...'
            ];

            let currentFakeStop = 0;
            let pauseFrames = 0;

            const interval = setInterval(() => {
                frame++;

                if (currentFakeStop < fakeStops.length && frame >= fakeStops[currentFakeStop]) {
                    if (pauseFrames === 0) {
                        setSuspenseMessage(suspenseMessages[currentFakeStop] || '⏳ Slowing down...');
                    }

                    pauseFrames++;

                    if (pauseFrames >= 40) {
                        pauseFrames = 0;
                        currentFakeStop++;
                        setSuspenseMessage('');
                    }
                    return;
                }

                const progress = frame / totalFrames;
                let speed;

                if (progress < 0.2) speed = 1;
                else if (progress < 0.4) speed = 2;
                else if (progress < 0.6) speed = 4;
                else if (progress < 0.8) speed = 8;
                else if (progress < 0.95) speed = 15;
                else speed = 25;

                if (frame % speed === 0) {
                    const randomTicket = Math.floor(
                        Math.random() * (settings.ticketEnd - settings.ticketStart + 1)
                    ) + settings.ticketStart;
                    setDisplayNumber(randomTicket);
                }

                if (frame >= totalFrames) {
                    clearInterval(interval);
                    setSuspenseMessage('');
                }
            }, 50);

            return () => {
                clearInterval(interval);
                setSuspenseMessage('');
            };
        }
    }, [drawStatus, settings.ticketStart, settings.ticketEnd, isFirstPrize]);

    // Show winner with confetti - PREMIUM COLORS
    useEffect(() => {
        if (drawStatus === 'winner-display' && currentWinner) {
            setDisplayNumber(currentWinner.ticketNumber);

            const duration = isFirstPrize ? 5000 : 3000;
            const end = Date.now() + duration;
            const colors = ['#D4AF37', '#F4E4C1', '#14B8A6', '#0EA5E9'];

            (function frame() {
                confetti({
                    particleCount: isFirstPrize ? 10 : 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors,
                });
                confetti({
                    particleCount: isFirstPrize ? 10 : 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors,
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            })();
        }
    }, [drawStatus, currentWinner, isFirstPrize]);

    return (
        <>
            {/* PHASE ANIMATIONS - Render selected phase during 'drawing' status */}
            {drawStatus === 'drawing' && currentWinner && currentPhase && (
                <>

                    {currentPhase === 'radar' && (
                        <RadarLockPhase
                            finalNumber={currentWinner.ticketNumber}
                            onComplete={completePhase}
                            prizeNumber={currentPrizeNumber}
                        />
                    )}


                    {currentPhase === 'flight' && (
                        <FlightHUDPhase
                            finalNumber={currentWinner.ticketNumber}
                            onComplete={completePhase}
                            prizeNumber={currentPrizeNumber}
                        />
                    )}

                    {currentPhase === 'flightRadar' && (
                        <FlightRadarPhase
                            finalNumber={currentWinner.ticketNumber}
                            onComplete={completePhase}
                            prizeNumber={currentPrizeNumber}
                        />
                    )}
                </>
            )}

            {/* FULL-SCREEN COUNTDOWN - Professional Corporate Style */}
            <AnimatePresence>
                {drawStatus === 'countdown' && !isFirstPrize && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-gradient-to-br from-[#0A1628]/98 via-[#0F1E35]/98 to-[#0A1628]/98 backdrop-blur-lg flex flex-col items-center justify-center gap-16"
                    >
                        {/* Subtle background glow */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-radial from-[#C9A961]/10 via-transparent to-transparent"
                            animate={{ opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />

                        {/* Prize Title - Clean, No Emojis */}
                        <motion.div
                            className="text-center px-4 z-10"
                            initial={{ y: -30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide text-[#C9A961] mb-4">
                                Drawing Prize #{currentPrizeNumber}
                            </h1>
                            <p className="text-xl md:text-2xl text-[#F5F5F0]/70 font-light">
                                Preparing to draw
                            </p>
                        </motion.div>

                        {/* Countdown Number - Huge, Clear, No Overlap */}
                        <motion.div
                            key={countdownValue}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="text-[14rem] md:text-[18rem] lg:text-[22rem] font-black z-10"
                            style={{
                                background: 'linear-gradient(135deg, #C9A961, #F5F5F0, #C9A961)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 0 40px rgba(201, 169, 97, 0.3))'
                            }}
                        >
                            {countdownValue}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Draw Area - Professional View */}
            <div className="relative h-full flex items-center justify-center p-8">
                <div className="text-center w-full max-w-2xl mx-auto">
                    {drawStatus === 'idle' && winners.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-12"
                        >
                            <Trophy className="w-24 h-24 mx-auto text-[#C9A961]/40 stroke-[1.5]" />
                            <div className="space-y-6">
                                <h2 className="text-4xl md:text-5xl text-[#C9A961] font-bold tracking-wide">
                                    Lucky Draw Ceremony
                                </h2>
                                <p className="text-2xl md:text-3xl text-[#F5F5F0]/80 font-light">
                                    {settings.numberOfPrizes} {settings.numberOfPrizes === 1 ? 'Prize' : 'Prizes'} to be Drawn
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {drawStatus === 'idle' && winners.length > 0 && winners.length < settings.numberOfPrizes && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-12"
                        >
                            <Trophy className="w-20 h-20 mx-auto text-[#C9A961]/40 stroke-[1.5]" />
                            <div className="space-y-6">
                                <h2 className="text-3xl md:text-4xl text-[#C9A961] font-bold tracking-wide">
                                    Ready for Next Draw
                                </h2>
                                <p className="text-xl md:text-2xl text-[#F5F5F0]/80 font-light">
                                    {remainingPrizes} {remainingPrizes === 1 ? 'Prize' : 'Prizes'} Remaining
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {(drawStatus === 'drawing' || drawStatus === 'winner-display') && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            {/* Prize Banner - Corporate Style */}
                            <motion.div
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="px-12 py-5 bg-gradient-to-r from-[#C9A961] to-[#D4C5A0] rounded-lg shadow-lg"
                            >
                                <span className="text-3xl md:text-4xl font-bold text-[#0A1628] tracking-wide">
                                    {drawStatus === 'drawing'
                                        ? `Drawing Prize #${currentPrizeNumber}`
                                        : `Prize #${currentPrizeNumber}`
                                    }
                                </span>
                            </motion.div>

                            {/* Suspense Message */}
                            <AnimatePresence>
                                {suspenseMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="text-3xl md:text-4xl text-[#14B8A6] font-black animate-pulse"
                                    >
                                        {suspenseMessage}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Number Display */}
                            <div className="relative p-1 rounded-3xl bg-gradient-to-br from-[#D4AF37] to-[#F4E4C1] shadow-2xl">
                                <div className={`absolute inset-0 rounded-3xl blur-xl opacity-60 ${drawStatus === 'winner-display' ? 'animate-glow-pulse' : ''
                                    }`} style={{
                                        background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)'
                                    }}></div>

                                <div className="relative bg-gradient-to-br from-[#0F1E35]/90 to-[#0A1628]/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 lg:p-16">
                                    <motion.div
                                        animate={drawStatus === 'winner-display' ? {
                                            scale: [0.8, 1.2, 1],
                                            rotate: [0, 5, -5, 0]
                                        } : {}}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="text-6xl md:text-8xl lg:text-9xl xl:text-[12rem] font-black"
                                        style={{
                                            background: 'linear-gradient(135deg, #D4AF37, #F4E4C1, #D4AF37)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            filter: drawStatus === 'drawing' ? 'blur(1px)' : 'blur(0px)'
                                        }}
                                    >
                                        {displayNumber}
                                    </motion.div>
                                </div>
                            </div>

                            {/* Label */}
                            <div className="text-2xl md:text-3xl text-[#F4E4C1] font-semibold">
                                <span className="inline-block w-2 h-2 rounded-full bg-[#D4AF37] mx-2"></span>
                                Ticket Number
                                <span className="inline-block w-2 h-2 rounded-full bg-[#D4AF37] mx-2"></span>
                            </div>

                            {/* Winner Confirmation - Corporate */}
                            {drawStatus === 'winner-display' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="text-2xl md:text-3xl text-[#C9A961] font-light tracking-wide"
                                >
                                    {isFirstPrize ? 'Winner Selected' : 'Winner Selected'}
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {winners.length >= settings.numberOfPrizes && drawStatus === 'winner-display' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-8 p-6 bg-[#C9A961]/10 border-2 border-[#C9A961] rounded-lg"
                        >
                            <p className="text-3xl font-bold text-[#C9A961] tracking-wide">
                                Draw Complete
                            </p>
                            <p className="text-xl text-[#F5F5F0]/70 mt-2 font-light">
                                All prizes have been awarded
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DrawArea;

import { useState, useEffect } from 'react';
import { useDrawContext } from '../context/DrawContext';
import Header from '../components/Header';
import DrawArea from '../components/DrawArea';
import WinnersList from '../components/WinnersList';
import FullScreenWinners from '../components/FullScreenWinners';
import MessageTicker from '../components/MessageTicker';
import { Play, SkipForward, Volume2, VolumeX, Sparkles, Maximize, Minimize } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useFullscreen } from '../hooks/useFullscreen';

const AudienceView = () => {
    const { settings, winners, drawStatus, startDraw, drawNextWinner } = useDrawContext();
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showCelebration, setShowCelebration] = useState(false);
    const { isFullscreen, enterFullscreen, toggleFullscreen } = useFullscreen();
    const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(true);
    const [showExitMessage, setShowExitMessage] = useState(false);
    const [showTip, setShowTip] = useState(true);

    const canStartDraw = drawStatus === 'idle' && winners.length === 0;
    const canDrawNext = drawStatus === 'winner-display' && winners.length < settings.numberOfPrizes;
    const allPrizesDrawn = winners.length >= settings.numberOfPrizes;
    const remainingPrizes = settings.numberOfPrizes - winners.length;

    // Celebration button handler
    const triggerCelebration = () => {
        setShowCelebration(true);

        const duration = 3000;
        const end = Date.now() + duration;
        const colors = ['#D4AF37', '#F4E4C1', '#14B8A6', '#0EA5E9'];

        (function frame() {
            confetti({
                particleCount: 15,
                angle: 60,
                spread: 70,
                origin: { x: 0, y: 0.6 },
                colors: colors,
            });
            confetti({
                particleCount: 15,
                angle: 120,
                spread: 70,
                origin: { x: 1, y: 0.6 },
                colors: colors,
            });
            confetti({
                particleCount: 10,
                angle: 90,
                spread: 100,
                origin: { x: 0.5, y: 0.5 },
                colors: colors,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            } else {
                setShowCelebration(false);
            }
        })();
    };

    // Handle fullscreen state changes
    useEffect(() => {
        if (isFullscreen) {
            setShowFullscreenPrompt(false);
            setShowExitMessage(false);
            document.body.style.overflow = 'hidden';
        } else {
            // Show exit message if user exits fullscreen
            if (!showFullscreenPrompt) {
                setShowExitMessage(true);
                setTimeout(() => setShowExitMessage(false), 5000);
            }
            document.body.style.overflow = 'auto';
        }
    }, [isFullscreen, showFullscreenPrompt]);

    // Hide tip after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => setShowTip(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`min-h-screen relative ${isFullscreen ? 'overflow-hidden' : 'overflow-hidden'}`}>
            {/* PREMIUM BACKGROUND - Deep Navy with Gold Accents */}
            <div className="fixed inset-0 z-0">
                {/* Base: Rich Navy Blue */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0F1E35] to-[#0A1628]"></div>

                {/* Overlay: Subtle Gold Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-[#D4AF37]/10"></div>

                {/* Animated Luxury Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4AF37] rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#14B8A6] rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0EA5E9] rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
            </div>

            {/* SOUND TOGGLE - Premium Style */}
            <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="fixed top-4 right-4 z-40 p-3 bg-[#0A1628]/90 backdrop-blur-md border-2 border-[#D4AF37]/50 rounded-full hover:bg-[#0F1E35] hover:border-[#D4AF37] transition-all shadow-xl"
                title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            >
                {soundEnabled ? (
                    <Volume2 className="w-6 h-6 text-[#D4AF37]" />
                ) : (
                    <VolumeX className="w-6 h-6 text-gray-400" />
                )}
            </button>

            {/* FULLSCREEN TOGGLE BUTTON */}
            <button
                onClick={toggleFullscreen}
                className="fixed top-4 right-20 z-40 p-3 bg-[#0A1628]/90 backdrop-blur-md border-2 border-[#D4AF37]/50 rounded-full hover:bg-[#0F1E35] hover:border-[#D4AF37] transition-all shadow-xl"
                title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            >
                {isFullscreen ? (
                    <Minimize className="w-6 h-6 text-[#D4AF37]" />
                ) : (
                    <Maximize className="w-6 h-6 text-[#D4AF37]" />
                )}
            </button>

            {/* FULLSCREEN ENTRY PROMPT OVERLAY */}
            <AnimatePresence>
                {showFullscreenPrompt && !isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-lg flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 20 }}
                            className="bg-gradient-to-br from-[#0F1E35] to-[#0A1628] border-2 border-[#D4AF37] rounded-3xl p-12 max-w-2xl text-center shadow-2xl"
                        >
                            <h2 className="text-4xl md:text-5xl font-black mb-6"
                                style={{
                                    background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                🎬 Stage Mode Ready
                            </h2>
                            <p className="text-xl text-[#F4E4C1] mb-8">
                                Press the button below to enter FULL-SCREEN mode for the event.
                            </p>
                            <button
                                onClick={() => {
                                    enterFullscreen();
                                    setShowFullscreenPrompt(false);
                                }}
                                className="px-12 py-6 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] hover:from-[#F4E4C1] hover:to-[#D4AF37] text-[#0A1628] rounded-2xl font-black text-2xl transition-all shadow-2xl flex items-center justify-center gap-4 mx-auto transform hover:scale-105"
                                style={{
                                    boxShadow: '0 0 30px rgba(212, 175, 55, 0.5)'
                                }}
                            >
                                <Maximize className="w-8 h-8" />
                                🎥 Enter Full Screen
                            </button>
                            <p className="text-sm text-[#14B8A6] mt-6">
                                Tip: Press <kbd className="px-2 py-1 bg-[#0A1628] border border-[#D4AF37] rounded">F</kbd> to toggle Full Screen anytime
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* EXIT FULLSCREEN MESSAGE */}
            <AnimatePresence>
                {showExitMessage && !isFullscreen && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-[#0A1628]/95 border-2 border-[#D4AF37] rounded-xl shadow-xl backdrop-blur-md"
                    >
                        <p className="text-[#F4E4C1] text-center">
                            Exited full-screen. Press <kbd className="px-2 py-1 bg-[#0F1E35] border border-[#D4AF37] rounded mx-1">F</kbd> or click the icon to return.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* KEYBOARD TIP */}
            <AnimatePresence>
                {showTip && !showFullscreenPrompt && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-[#0A1628]/90 border border-[#D4AF37]/50 rounded-lg shadow-lg backdrop-blur-md"
                    >
                        <p className="text-sm text-[#14B8A6]">
                            💡 Tip: Press <kbd className="px-1.5 py-0.5 bg-[#0F1E35] border border-[#D4AF37] rounded text-xs">F</kbd> to toggle Full Screen
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PREMIUM STATS TICKER */}
            <div className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-[#0A1628]/95 via-[#0F1E35]/95 to-[#0A1628]/95 backdrop-blur-md border-b-2 border-[#D4AF37]/30 py-2 px-4">
                <div className="max-w-7xl mx-auto flex justify-around items-center text-sm md:text-base">
                    <div className="flex items-center gap-2">
                        <span className="text-[#F4E4C1]">Total Prizes:</span>
                        <span className="font-black text-[#D4AF37]">{settings.numberOfPrizes}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[#F4E4C1]">Drawn:</span>
                        <span className="font-black text-[#14B8A6]">{winners.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[#F4E4C1]">Remaining:</span>
                        <span className="font-black text-[#0EA5E9]">{remainingPrizes}</span>
                    </div>
                </div>

                {/* Premium Progress Bar */}
                <div className="max-w-7xl mx-auto mt-2">
                    <div className="w-full h-1.5 bg-[#0A1628] rounded-full overflow-hidden border border-[#D4AF37]/20">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F4E4C1] to-[#D4AF37]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(winners.length / settings.numberOfPrizes) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <Header />

                <div className="flex-1 px-4 md:px-6 lg:px-8 flex items-center py-8">
                    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                        {/* Center - Draw Area */}
                        <div className="lg:col-span-8 flex flex-col">
                            <div className="bg-gradient-to-br from-[#0F1E35]/80 to-[#0A1628]/80 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-[#D4AF37]/30 flex flex-col overflow-hidden min-h-[400px]">
                                <div className="flex-1 overflow-y-auto p-8">
                                    <DrawArea />
                                </div>

                                {/* Premium Action Buttons */}
                                <div className="p-4 md:p-6 flex flex-wrap justify-center items-center gap-4 border-t-2 border-[#D4AF37]/20">
                                    {canStartDraw && (
                                        <button
                                            onClick={startDraw}
                                            className="w-full md:w-auto px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] hover:from-[#F4E4C1] hover:to-[#D4AF37] text-[#0A1628] rounded-2xl font-black text-xl md:text-2xl lg:text-3xl transition-all shadow-2xl flex items-center justify-center gap-3 md:gap-4 transform hover:scale-105"
                                            style={{
                                                boxShadow: '0 0 30px rgba(212, 175, 55, 0.5)'
                                            }}
                                        >
                                            <Play className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                                            <span className="whitespace-nowrap">🎉 Start Lucky Draw 🎉</span>
                                        </button>
                                    )}

                                    {canDrawNext && (
                                        <>
                                            <button
                                                onClick={drawNextWinner}
                                                className="flex-1 md:flex-none px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] hover:from-[#F4E4C1] hover:to-[#D4AF37] text-[#0A1628] rounded-2xl font-black text-xl md:text-2xl lg:text-3xl transition-all shadow-2xl flex items-center justify-center gap-3 md:gap-4 transform hover:scale-105"
                                                style={{
                                                    boxShadow: '0 0 30px rgba(212, 175, 55, 0.5)'
                                                }}
                                            >
                                                <SkipForward className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                                                <span className="whitespace-nowrap">Draw Next Winner</span>
                                            </button>

                                            {/* CELEBRATION BUTTON */}
                                            <button
                                                onClick={triggerCelebration}
                                                className="px-6 md:px-8 py-4 md:py-6 bg-gradient-to-r from-[#14B8A6] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#14B8A6] text-white rounded-2xl font-black text-lg md:text-xl transition-all shadow-2xl flex items-center justify-center gap-2 md:gap-3 transform hover:scale-105"
                                            >
                                                <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                                                <span className="whitespace-nowrap">🎉 Celebrate!</span>
                                            </button>
                                        </>
                                    )}

                                    {allPrizesDrawn && (
                                        <div className="w-full md:w-auto px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-[#14B8A6] to-[#0EA5E9] text-white rounded-2xl font-black text-xl md:text-2xl lg:text-3xl shadow-2xl text-center">
                                            🎊 All Prizes Drawn! 🎊
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Winners List */}
                        <div className="lg:col-span-4 min-h-[300px] lg:min-h-[500px]">
                            <WinnersList />
                        </div>
                    </div>
                </div>
            </div>

            <FullScreenWinners />
            <MessageTicker />

            {/* Celebration Overlay */}
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0]
                            }}
                            transition={{ duration: 0.5, repeat: 5 }}
                            className="text-8xl md:text-9xl"
                        >
                            🎉
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Vignette Effect in Fullscreen */}
            {isFullscreen && (
                <div className="fixed inset-0 pointer-events-none z-[100]"
                    style={{
                        background: 'radial-gradient(circle at center, transparent 40%, rgba(10, 22, 40, 0.4) 100%)',
                    }}
                />
            )}

            {/* Fullscreen Scaling Styles */}
            <style>{`
                /* Fullscreen mode enhancements */
                :fullscreen {
                    background: #0A1628;
                }
                :-webkit-full-screen {
                    background: #0A1628;
                }
                :-moz-full-screen {
                    background: #0A1628;
                }
                :-ms-fullscreen {
                    background: #0A1628;
                }

                /* Larger text in fullscreen */
                :fullscreen .text-xl { font-size: clamp(1.5rem, 2vw, 2rem); }
                :fullscreen .text-2xl { font-size: clamp(2rem, 2.5vw, 2.5rem); }
                :fullscreen .text-3xl { font-size: clamp(2.5rem, 3vw, 3rem); }
                :fullscreen .text-4xl { font-size: clamp(3rem, 4vw, 4rem); }
                :fullscreen .text-5xl { font-size: clamp(4rem, 5vw, 5rem); }
            `}</style>
        </div>
    );
};

export default AudienceView;

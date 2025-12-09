import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface CinematicGrandPrizeProps {
    isVisible: boolean;
    onComplete: () => void;
    finalNumber: number;
}

const CinematicGrandPrize = ({ isVisible, onComplete, finalNumber }: CinematicGrandPrizeProps) => {
    const [phase, setPhase] = useState<'countdown' | 'chaos' | 'lockOn' | 'glitch' | 'reveal' | 'celebrate'>('countdown');
    const [countdownValue, setCountdownValue] = useState(10);
    const [displayNumber, setDisplayNumber] = useState(finalNumber);
    const [isGlitching, setIsGlitching] = useState(false);
    const [showBlackout, setShowBlackout] = useState(false);
    const [glitchText, setGlitchText] = useState('');

    // Countdown phase messages
    const getCountdownMessage = (value: number) => {
        if (value >= 6) return 'Get Ready...';
        if (value >= 3) return 'Brace yourself...';
        if (value >= 1) return 'Final moments...';
        return 'Here we go!';
    };

    // Generate random glitch text
    const generateGlitchText = () => {
        const chars = '0123456789ABCDEF';
        return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    // Countdown logic
    useEffect(() => {
        if (!isVisible || phase !== 'countdown') return;

        if (countdownValue > 0) {
            const timer = setTimeout(() => {
                // Random glitch chance (30%)
                if (Math.random() < 0.3 && countdownValue > 1) {
                    triggerGlitch();
                }
                setCountdownValue(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            // Countdown complete, move to chaos phase
            setTimeout(() => setPhase('chaos'), 500);
        }
    }, [isVisible, phase, countdownValue]);

    // Trigger glitch effect
    const triggerGlitch = () => {
        const glitchType = Math.random();

        if (glitchType < 0.5) {
            // Blackout glitch
            setShowBlackout(true);
            setTimeout(() => {
                setShowBlackout(false);
                // Sometimes jump back one second
                if (Math.random() < 0.5 && countdownValue < 10) {
                    setCountdownValue(prev => Math.min(prev + 1, 10));
                }
            }, 600);
        } else {
            // Digit glitch
            setIsGlitching(true);
            setGlitchText(generateGlitchText());
            setTimeout(() => {
                setIsGlitching(false);
                setGlitchText('');
            }, 150);
        }
    };

    // Chaos Matrix phase
    useEffect(() => {
        if (phase !== 'chaos') return;

        const interval = setInterval(() => {
            setDisplayNumber(Math.floor(Math.random() * 90000) + 10000);
        }, 50);

        const timer = setTimeout(() => {
            clearInterval(interval);
            setPhase('lockOn');
        }, 3000);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [phase]);

    // Lock-on phase
    useEffect(() => {
        if (phase !== 'lockOn') return;

        let speed = 50;
        const interval = setInterval(() => {
            setDisplayNumber(Math.floor(Math.random() * 90000) + 10000);
            speed += 20; // Slow down
        }, speed);

        const timer = setTimeout(() => {
            clearInterval(interval);
            setPhase('glitch');
        }, 4000);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [phase]);

    // Final glitch before reveal
    useEffect(() => {
        if (phase !== 'glitch') return;

        setShowBlackout(true);
        setTimeout(() => {
            setShowBlackout(false);
            setIsGlitching(true);
            setTimeout(() => {
                setIsGlitching(false);
                setPhase('reveal');
            }, 300);
        }, 800);
    }, [phase]);

    // Reveal phase
    useEffect(() => {
        if (phase !== 'reveal') return;

        setDisplayNumber(finalNumber);

        // Confetti
        const duration = 5000;
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

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();

        setTimeout(() => {
            setPhase('celebrate');
            setTimeout(() => onComplete(), 3000);
        }, 2000);
    }, [phase, finalNumber, onComplete]);

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#0A1628] via-[#0F1E35] to-[#0A1628] overflow-hidden"
        >
            {/* Ambient Particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-[#D4AF37] rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.6, 0.2],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Radar Circles */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full border border-[#D4AF37]/10"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                    className="absolute w-[800px] h-[800px] rounded-full border border-[#D4AF37]/5"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                />
            </div>

            {/* Blackout Overlay */}
            <AnimatePresence>
                {showBlackout && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black z-50"
                    >
                        {/* Static noise effect */}
                        <div className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="relative h-full flex flex-col items-center justify-center px-4">
                {/* HUD Header */}
                <motion.div
                    className="absolute top-20 left-0 right-0"
                    animate={isGlitching ? { x: [-2, 2, -2, 0] } : {}}
                    transition={{ duration: 0.1 }}
                >
                    {/* Navigation Line with Ticks */}
                    <div className="relative h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto w-3/4 mb-4">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-px h-2 bg-[#D4AF37]"
                                style={{ left: `${i * 5}%`, top: '-4px' }}
                            />
                        ))}
                        {/* Moving Chevrons */}
                        <motion.div
                            className="absolute top-0 left-0 text-[#D4AF37] text-xs"
                            animate={{ x: ['0%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        >
                            ▸▸▸
                        </motion.div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl font-black text-center mb-2"
                        style={{
                            background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 0 40px rgba(212, 175, 55, 0.5)',
                        }}
                    >
                        🏆 GRAND PRIZE DRAW! 🏆
                    </h1>
                </motion.div>

                {/* Countdown Phase */}
                {phase === 'countdown' && (
                    <motion.div
                        className="relative"
                        animate={isGlitching ? { x: [-5, 5, -5, 0], y: [-3, 3, -3, 0] } : {}}
                    >
                        {/* Message */}
                        <motion.p
                            className="text-2xl md:text-3xl text-[#14B8A6] text-center mb-8"
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            {getCountdownMessage(countdownValue)}
                        </motion.p>

                        {/* Countdown Number */}
                        <motion.div
                            key={countdownValue}
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: [0.7, 1.1, 1], opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                            className="text-[20rem] font-black text-center relative"
                        >
                            {/* Glow */}
                            <div className="absolute inset-0 blur-3xl opacity-50"
                                style={{
                                    background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
                                }}
                            />

                            {/* Number */}
                            <div style={{
                                background: 'linear-gradient(135deg, #D4AF37, #F4E4C1, #D4AF37)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                {isGlitching ? glitchText : countdownValue}
                            </div>
                        </motion.div>

                        {/* Flight Path Progress */}
                        <div className="mt-12 w-96 mx-auto">
                            <div className="relative h-1 bg-[#D4AF37]/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="absolute h-full bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1]"
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${((10 - countdownValue) / 10) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                                {/* Airplane Icon */}
                                <motion.div
                                    className="absolute top-1/2 -translate-y-1/2 text-2xl"
                                    animate={{ left: `${((10 - countdownValue) / 10) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                >
                                    ✈️
                                </motion.div>
                            </div>
                        </div>

                        {/* Circular Progress Ring */}
                        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] -z-10">
                            <motion.circle
                                cx="250"
                                cy="250"
                                r="200"
                                fill="none"
                                stroke="#D4AF37"
                                strokeWidth="2"
                                strokeDasharray="1256"
                                strokeDashoffset={1256 - (1256 * (10 - countdownValue) / 10)}
                                style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                                opacity="0.3"
                            />
                        </svg>
                    </motion.div>
                )}

                {/* Chaos Matrix Phase */}
                {phase === 'chaos' && (
                    <div className="relative">
                        {/* Matrix Rain */}
                        <div className="absolute inset-0 overflow-hidden opacity-20">
                            {[...Array(10)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute text-[#14B8A6] font-mono text-sm"
                                    style={{ left: `${i * 10}%` }}
                                    animate={{ y: ['-100%', '100vh'] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                >
                                    {Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join('')}
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 0.3, repeat: Infinity }}
                            className="text-9xl font-black"
                            style={{
                                background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'blur(1px)',
                            }}
                        >
                            {displayNumber}
                        </motion.div>
                        <p className="text-2xl text-[#14B8A6] text-center mt-4 animate-pulse">
                            SCANNING TICKETS...
                        </p>
                    </div>
                )}

                {/* Lock-On Phase */}
                {phase === 'lockOn' && (
                    <div className="relative">
                        {/* Radar Lock */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-2 border-[#14B8A6]"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />

                        <motion.div
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="text-9xl font-black"
                            style={{
                                background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {displayNumber}
                        </motion.div>
                        <p className="text-2xl text-[#14B8A6] text-center mt-4 animate-pulse">
                            🎯 LOCKING TARGET...
                        </p>
                    </div>
                )}

                {/* Reveal & Celebrate Phase */}
                {(phase === 'reveal' || phase === 'celebrate') && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                        className="relative"
                    >
                        {/* Rays of Light */}
                        <div className="absolute inset-0 -z-10">
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute top-1/2 left-1/2 w-2 h-96 bg-gradient-to-t from-[#D4AF37]/50 to-transparent origin-bottom"
                                    style={{
                                        transform: `rotate(${i * 30}deg) translateY(-50%)`,
                                    }}
                                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                                />
                            ))}
                        </div>

                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                textShadow: [
                                    '0 0 40px rgba(212, 175, 55, 0.5)',
                                    '0 0 80px rgba(212, 175, 55, 0.8)',
                                    '0 0 40px rgba(212, 175, 55, 0.5)',
                                ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-[12rem] font-black"
                            style={{
                                background: 'linear-gradient(135deg, #D4AF37, #F4E4C1, #D4AF37)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {finalNumber}
                        </motion.div>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-4xl text-[#14B8A6] font-bold text-center mt-8"
                        >
                            🎊 GRAND PRIZE WINNER! 🎊
                        </motion.p>
                    </motion.div>
                )}
            </div>

            {/* Add custom CSS for glow animation */}
            <style>{`
                @keyframes glow-pulse {
                    0%, 100% { filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.5)); }
                    50% { filter: drop-shadow(0 0 40px rgba(212, 175, 55, 0.9)); }
                }
                .animate-glow-pulse {
                    animation: glow-pulse 2s ease-in-out infinite;
                }
            `}</style>
        </motion.div>
    );
};

export default CinematicGrandPrize;

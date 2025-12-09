import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface RadarLockPhaseProps {
    finalNumber: number;
    onComplete: () => void;
    prizeNumber: number;
}

const RadarLockPhase = ({ finalNumber, onComplete, prizeNumber }: RadarLockPhaseProps) => {
    const [phase, setPhase] = useState<'scanning' | 'locking' | 'locked' | 'reveal'>('scanning');
    const [displayNumber, setDisplayNumber] = useState(10000);
    const [lockProgress, setLockProgress] = useState(0);
    const [targetAngle, setTargetAngle] = useState(0);

    useEffect(() => {
        let frame = 0;
        const totalFrames = 100; // 5 seconds

        const interval = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;

            if (progress < 0.4) {
                // Scanning phase
                setPhase('scanning');
                const randomNum = Math.floor(Math.random() * 90000) + 10000;
                setDisplayNumber(randomNum);
                setTargetAngle((frame * 36) % 360);
            } else if (progress < 0.7) {
                // Locking phase
                setPhase('locking');
                setLockProgress((progress - 0.4) / 0.3);
                const randomNum = Math.floor(Math.random() * 90000) + 10000;
                setDisplayNumber(randomNum);
            } else if (progress < 0.85) {
                // Locked phase
                setPhase('locked');
                setLockProgress(1);
            } else {
                // Reveal
                setPhase('reveal');
                setDisplayNumber(finalNumber);
            }

            if (frame >= totalFrames) {
                clearInterval(interval);

                // Confetti - Corporate colors only
                const colors = ['#C9A961', '#F5F5F0', '#D4C5A0'];
                confetti({
                    particleCount: 50,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: colors,
                });

                setTimeout(() => onComplete(), 2000);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [finalNumber, onComplete]);

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#0A1628] via-[#0F1E35] to-[#0A1628] flex flex-col items-center justify-center">
            {/* Darkened Background */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Grid Pattern - Subtle */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(201, 169, 97, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(201, 169, 97, 0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                }}></div>
            </div>

            {/* Prize Banner - Corporate */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute top-20 px-12 py-4 bg-[#C9A961]/10 border-2 border-[#C9A961] rounded-lg backdrop-blur-md"
            >
                <h2 className="text-3xl font-bold text-[#C9A961] tracking-wide">
                    Drawing Prize #{prizeNumber}
                </h2>
            </motion.div>

            {/* Main Radar Display */}
            <div className="relative">
                {/* Outer Radar Circles */}
                {[300, 400, 500].map((size, i) => (
                    <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 rounded-full border-2 border-[#C9A961]/20"
                        style={{
                            width: size,
                            height: size,
                            marginLeft: -size / 2,
                            marginTop: -size / 2,
                        }}
                        animate={{
                            scale: phase === 'locking' ? [1, 1.02, 1] : 1,
                        }}
                        transition={{ duration: 1.5, repeat: phase === 'locking' ? Infinity : 0 }}
                    />
                ))}

                {/* Radar Sweep Line */}
                <motion.div
                    className="absolute top-1/2 left-1/2 origin-left h-1 bg-gradient-to-r from-[#C9A961] to-transparent"
                    style={{
                        width: 250,
                        transformOrigin: 'left center',
                    }}
                    animate={{
                        rotate: phase === 'scanning' ? targetAngle : 45,
                    }}
                    transition={{ duration: 0.5, ease: 'linear' }}
                />

                {/* Center Display */}
                <div className="relative w-96 h-96 rounded-full border-4 border-[#C9A961] bg-gradient-to-br from-[#0A1628]/90 to-[#0F1E35]/90 backdrop-blur-xl flex items-center justify-center">
                    {/* Crosshair */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-px bg-[#C9A961]/20"></div>
                        <div className="absolute w-px h-full bg-[#C9A961]/20"></div>
                    </div>

                    {/* Number Display */}
                    <motion.div
                        className="relative z-10"
                        animate={phase === 'reveal' ? {
                            scale: [0.9, 1.1, 1],
                        } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="text-8xl font-black"
                            style={{
                                background: phase === 'reveal'
                                    ? 'linear-gradient(135deg, #C9A961, #F5F5F0)'
                                    : 'linear-gradient(135deg, #C9A961, #D4C5A0)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: phase === 'scanning' || phase === 'locking' ? 'blur(1px)' : 'blur(0px)',
                            }}
                        >
                            {displayNumber}
                        </div>
                    </motion.div>

                    {/* Lock Progress Ring */}
                    {phase === 'locking' && (
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                fill="none"
                                stroke="#C9A961"
                                strokeWidth="3"
                                strokeDasharray="1000"
                                strokeDashoffset={1000 - (1000 * lockProgress)}
                                style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                            />
                        </svg>
                    )}
                </div>

                {/* Target Dots */}
                {phase === 'scanning' && [...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-[#C9A961]/60 rounded-full"
                        style={{
                            top: '50%',
                            left: '50%',
                            marginTop: -4,
                            marginLeft: -4,
                        }}
                        animate={{
                            x: Math.cos((i * 60 + targetAngle) * Math.PI / 180) * 200,
                            y: Math.sin((i * 60 + targetAngle) * Math.PI / 180) * 200,
                            opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                ))}
            </div>

            {/* Status Text - Corporate Language */}
            <AnimatePresence>
                <motion.div
                    className="absolute bottom-32 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {phase === 'scanning' && (
                        <p className="text-2xl text-[#C9A961]/80 font-light tracking-wide">
                            Scanning entries...
                        </p>
                    )}
                    {phase === 'locking' && (
                        <p className="text-2xl text-[#C9A961] font-medium tracking-wide">
                            Selecting winner... {Math.floor(lockProgress * 100)}%
                        </p>
                    )}
                    {phase === 'locked' && (
                        <p className="text-3xl text-[#C9A961] font-bold tracking-wide">
                            Selection Complete
                        </p>
                    )}
                    {phase === 'reveal' && (
                        <p className="text-4xl text-[#C9A961] font-bold tracking-wide">
                            Winner Selected
                        </p>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Beep indicator (visual) */}
            {phase === 'scanning' && (
                <motion.div
                    className="absolute top-4 right-4 w-4 h-4 bg-[#14B8A6] rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                />
            )}
        </div>
    );
};

export default RadarLockPhase;

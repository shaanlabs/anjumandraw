import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface FlightRadarPhaseProps {
    finalNumber: number;
    onComplete: () => void;
    prizeNumber: number;
}

const FlightRadarPhase = ({ finalNumber, onComplete, prizeNumber }: FlightRadarPhaseProps) => {
    const [phase, setPhase] = useState<'takeoff' | 'approach' | 'lock' | 'reveal'>('takeoff');
    const [displayNumber, setDisplayNumber] = useState(10000);
    const [lockProgress, setLockProgress] = useState(0);
    const [planeAngle, setPlaneAngle] = useState(45); // degrees around circle
    const [radarAngle, setRadarAngle] = useState(0);

    useEffect(() => {
        let frame = 0;
        const totalFrames = 200; // 10 seconds at 50ms intervals

        const interval = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;

            if (progress < 0.3) {
                // PHASE 1: Takeoff (0-3s)
                setPhase('takeoff');
                setPlaneAngle(45 + progress * 360); // Plane circles around
                setRadarAngle((radarAngle + 5) % 360);
                setDisplayNumber(Math.floor(Math.random() * 90000) + 10000);
            } else if (progress < 0.7) {
                // PHASE 2: Approach + Lock Progress (3-7s)
                setPhase('approach');
                const approachProgress = (progress - 0.3) / 0.4;
                setPlaneAngle(45 + 360 + approachProgress * 180); // Continue circling, slowing down
                setLockProgress(Math.floor(approachProgress * 80));
                setRadarAngle((radarAngle + 8) % 360);

                // Slow down number changes
                if (frame % 2 === 0) {
                    setDisplayNumber(Math.floor(Math.random() * 90000) + 10000);
                }
            } else if (progress < 0.9) {
                // PHASE 3: Lock-on (7-9s)
                setPhase('lock');
                const lockPhaseProgress = (progress - 0.7) / 0.2;
                setPlaneAngle(45 + 540 + lockPhaseProgress * 90); // Final approach to center
                setLockProgress(80 + Math.floor(lockPhaseProgress * 20));
                setRadarAngle((radarAngle + 12) % 360);

                // Very slow number changes
                if (frame % 4 === 0) {
                    setDisplayNumber(Math.floor(Math.random() * 90000) + 10000);
                }
            } else {
                // PHASE 4: Reveal (9-10s)
                setPhase('reveal');
                setPlaneAngle(90); // Plane at bottom (landed)
                setLockProgress(100);
                setDisplayNumber(finalNumber);
            }

            if (frame >= totalFrames) {
                clearInterval(interval);

                // Confetti - Corporate
                const colors = ['#C9A961', '#F5F5F0'];
                confetti({
                    particleCount: 50,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: colors,
                    startVelocity: 40,
                });

                setTimeout(() => onComplete(), 2000);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [finalNumber, onComplete]);

    // Calculate plane position on circle
    const radius = 140;
    const planeX = Math.cos((planeAngle - 90) * Math.PI / 180) * radius;
    const planeY = Math.sin((planeAngle - 90) * Math.PI / 180) * radius;

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#001a33] via-[#003d5c] to-[#00293d] flex flex-col items-center justify-center overflow-hidden">
            {/* HUD Grid Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(14, 165, 233, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.2) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}></div>
            </div>

            {/* Top Banner */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute top-20 px-12 py-4 bg-[#C9A961]/10 border-2 border-[#C9A961] rounded-lg backdrop-blur-md"
            >
                <h2 className="text-3xl font-bold text-[#C9A961] tracking-wide">
                    Drawing Prize #{prizeNumber}
                </h2>
            </motion.div>

            {/* Main Radar Circle */}
            <div className="relative w-[min(70vw,70vh)] max-w-full max-h-full aspect-square flex items-center justify-center">
                {/* Radar Rings */}
                {[300, 240, 180, 120].map((size, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full border-2 border-[#14B8A6]/20"
                        style={{
                            width: size,
                            height: size,
                        }}
                        animate={phase === 'lock' ? {
                            scale: [1, 1.02, 1],
                            borderColor: ['rgba(20, 184, 166, 0.2)', 'rgba(20, 184, 166, 0.5)', 'rgba(20, 184, 166, 0.2)'],
                        } : {}}
                        transition={{ duration: 1, repeat: phase === 'lock' ? Infinity : 0 }}
                    />
                ))}

                {/* Radar Sweep Line */}
                <motion.div
                    className="absolute w-full h-full"
                    style={{ rotate: radarAngle }}
                >
                    <div className="absolute top-1/2 left-1/2 origin-left h-1 bg-gradient-to-r from-[#14B8A6] to-transparent"
                        style={{
                            width: 150,
                            transformOrigin: 'left center',
                        }}
                    />
                </motion.div>

                {/* Horizon Line (Flight HUD) */}
                <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#0EA5E9]/30 to-transparent top-1/2"></div>

                {/* Altitude Markers (Left) */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 space-y-2">
                    {[10, 7.5, 5, 2.5, 0].map((alt) => (
                        <div key={alt} className="flex items-center gap-1">
                            <div className="w-4 h-px bg-[#0EA5E9]/50"></div>
                            <span className="text-xs text-[#0EA5E9]/70">{alt}k</span>
                        </div>
                    ))}
                </div>

                {/* Distance Markers (Right) */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 space-y-2">
                    {[100, 75, 50, 25, 0].map((dist) => (
                        <div key={dist} className="flex items-center gap-1">
                            <span className="text-xs text-[#0EA5E9]/70">{dist}nm</span>
                            <div className="w-4 h-px bg-[#0EA5E9]/50"></div>
                        </div>
                    ))}
                </div>

                {/* Airplane Icon */}
                <AnimatePresence>
                    {phase !== 'reveal' && (
                        <motion.div
                            className="absolute text-4xl"
                            style={{
                                left: `calc(50% + ${planeX}px)`,
                                top: `calc(50% + ${planeY}px)`,
                            }}
                            animate={{
                                rotate: planeAngle,
                            }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            ✈
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Center Lock-on Scope */}
                <div className="relative w-64 h-64 rounded-full border-4 border-[#0EA5E9] bg-gradient-to-br from-[#0a0e27]/90 to-[#16213e]/90 backdrop-blur-xl flex items-center justify-center">
                    {/* Crosshair */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-px bg-[#0EA5E9]/50"></div>
                        <div className="absolute w-px h-full bg-[#0EA5E9]/50"></div>
                    </div>

                    {/* Corner Brackets */}
                    {[0, 90, 180, 270].map((angle) => (
                        <div
                            key={angle}
                            className="absolute w-8 h-8 border-t-2 border-l-2 border-[#14B8A6]"
                            style={{
                                transform: `rotate(${angle}deg)`,
                                top: angle === 0 || angle === 90 ? 8 : 'auto',
                                bottom: angle === 180 || angle === 270 ? 8 : 'auto',
                                left: angle === 0 || angle === 270 ? 8 : 'auto',
                                right: angle === 90 || angle === 180 ? 8 : 'auto',
                            }}
                        />
                    ))}

                    {/* Number Display */}
                    <motion.div
                        className="relative z-10"
                        animate={phase === 'reveal' ? {
                            scale: [0.8, 1.2, 1],
                        } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="text-[clamp(3rem,10vw,6.5rem)] font-black"
                            style={{
                                background: phase === 'reveal'
                                    ? 'linear-gradient(135deg, #D4AF37, #F4E4C1)'
                                    : 'linear-gradient(135deg, #0EA5E9, #14B8A6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: phase === 'takeoff' || phase === 'approach' ? 'blur(1px)' : 'blur(0px)',
                                textShadow: phase === 'reveal' ? '0 0 60px rgba(212, 175, 55, 0.8)' : 'none',
                            }}
                        >
                            {displayNumber}
                        </div>
                    </motion.div>

                    {/* Lock Progress Ring */}
                    {lockProgress > 0 && lockProgress < 100 && (
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="48%"
                                fill="none"
                                stroke="#14B8A6"
                                strokeWidth="3"
                                strokeDasharray="1000"
                                strokeDashoffset={1000 - (1000 * lockProgress / 100)}
                                style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                            />
                        </svg>
                    )}

                    {/* Lock Complete Indicator */}
                    {lockProgress === 100 && phase !== 'reveal' && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-12 text-4xl"
                        >

                        </motion.div>
                    )}

                    {/* Rays of Light on Reveal */}
                    {phase === 'reveal' && (
                        <div className="absolute inset-0 -z-10">
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute top-1/2 left-1/2 w-2 h-[400px] bg-gradient-to-t from-[#D4AF37]/60 to-transparent origin-bottom"
                                    style={{
                                        transform: `rotate(${i * 30}deg) translateY(-50%)`,
                                    }}
                                    animate={{
                                        opacity: [0.4, 0.8, 0.4],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Status Messages */}
            <AnimatePresence>
                <motion.div
                    className="absolute bottom-32 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {phase === 'takeoff' && (
                        <p className="text-2xl text-[#C9A961]/80 font-light tracking-wide">
                            Approaching entries...
                        </p>
                    )}
                    {phase === 'approach' && (
                        <p className="text-2xl text-[#C9A961] font-medium tracking-wide">
                            Selecting winner... {lockProgress}%
                        </p>
                    )}
                    {phase === 'lock' && (
                        <p className="text-3xl text-[#C9A961] font-bold tracking-wide">
                            Final selection... {lockProgress}%
                        </p>
                    )}
                    {phase === 'reveal' && (
                        <p className="text-4xl text-[#C9A961] font-bold tracking-wide">
                            Winner Selected
                        </p>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default FlightRadarPhase;

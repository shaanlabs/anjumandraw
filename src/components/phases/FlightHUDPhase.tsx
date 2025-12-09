import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface FlightHUDPhaseProps {
    finalNumber: number;
    onComplete: () => void;
    prizeNumber: number;
}

const FlightHUDPhase = ({ finalNumber, onComplete, prizeNumber }: FlightHUDPhaseProps) => {
    const [phase, setPhase] = useState<'descending' | 'approaching' | 'landing' | 'landed'>('descending');
    const [altitude, setAltitude] = useState(10000);
    const [displayNumber, setDisplayNumber] = useState(0);
    const [numberY, setNumberY] = useState(-500);

    useEffect(() => {
        let frame = 0;
        const totalFrames = 120; // 6 seconds

        const interval = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;

            if (progress < 0.5) {
                // Descending phase
                setPhase('descending');
                setAltitude(Math.floor(10000 - (progress * 20000)));
                setDisplayNumber(Math.floor(Math.random() * 90000) + 10000);
            } else if (progress < 0.75) {
                // Approaching runway
                setPhase('approaching');
                setAltitude(Math.floor(5000 - ((progress - 0.5) * 20000)));
                setNumberY(-500 + ((progress - 0.5) / 0.25) * 300);
            } else if (progress < 0.95) {
                // Landing
                setPhase('landing');
                setAltitude(Math.floor(1000 - ((progress - 0.75) * 5000)));
                setNumberY(-200 + ((progress - 0.75) / 0.2) * 200);
                setDisplayNumber(finalNumber);
            } else {
                // Landed
                setPhase('landed');
                setAltitude(0);
                setNumberY(0);
                setDisplayNumber(finalNumber);
            }

            if (frame >= totalFrames) {
                clearInterval(interval);

                // Confetti - Corporate
                const colors = ['#C9A961', '#F5F5F0'];
                confetti({
                    particleCount: 60,
                    spread: 100,
                    origin: { y: 0.7 },
                    colors: colors,
                    startVelocity: 40,
                });

                setTimeout(() => onComplete(), 2000);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [finalNumber, onComplete]);

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#001a33] via-[#003d5c] to-[#00293d] flex flex-col items-center justify-center overflow-hidden">
            {/* HUD Grid Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(14, 165, 233, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.2) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}></div>
            </div>

            {/* Top HUD Bar */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent border-b border-[#0EA5E9]/30 flex items-center justify-between px-8">
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[#0EA5E9] font-mono">FLIGHT SYSTEM ACTIVE</span>
                </div>
                <div className="text-[#0EA5E9] font-mono">
                    PRIZE #{prizeNumber}
                </div>
            </div>

            {/* Altitude Markers (Left Side) */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 space-y-4">
                {[10000, 7500, 5000, 2500, 1000, 500, 0].map((alt) => (
                    <div key={alt} className="flex items-center gap-2">
                        <div className={`w-8 h-px ${altitude <= alt ? 'bg-green-500' : 'bg-[#0EA5E9]/30'}`}></div>
                        <span className={`text-sm font-mono ${altitude <= alt ? 'text-green-500' : 'text-[#0EA5E9]/50'}`}>
                            {alt}ft
                        </span>
                    </div>
                ))}
            </div>

            {/* Altitude Display (Right Side) */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-right">
                <div className="text-sm text-[#0EA5E9] font-mono mb-2">ALTITUDE</div>
                <motion.div
                    className="text-6xl font-black font-mono"
                    style={{
                        color: altitude < 1000 ? '#10b981' : '#0EA5E9',
                    }}
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                >
                    {Math.max(0, altitude)}
                </motion.div>
                <div className="text-xs text-[#0EA5E9]/70 font-mono mt-1">FEET</div>
            </div>

            {/* Center - Descending Number */}
            <div className="relative">
                {/* Runway at bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-2 bg-gradient-to-r from-transparent via-white to-transparent"
                    style={{
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                    }}
                ></div>

                {/* Runway Lights */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-8">
                    {[...Array(7)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-white rounded-full"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                        />
                    ))}
                </div>

                {/* Descending Number */}
                <motion.div
                    className="relative"
                    style={{ y: numberY }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Crosshair around number */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-96 h-96 border-2 border-[#0EA5E9]/30 rounded-full"></div>
                        <div className="absolute w-full h-px bg-[#0EA5E9]/30"></div>
                        <div className="absolute w-px h-full bg-[#0EA5E9]/30"></div>
                    </div>

                    {/* Number Display */}
                    <motion.div
                        className="text-9xl font-black"
                        style={{
                            background: phase === 'landed'
                                ? 'linear-gradient(135deg, #D4AF37, #F4E4C1)'
                                : 'linear-gradient(135deg, #0EA5E9, #14B8A6)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: phase === 'descending' || phase === 'approaching' ? 'blur(1px)' : 'blur(0px)',
                            textShadow: phase === 'landed' ? '0 0 60px rgba(212, 175, 55, 0.8)' : 'none',
                        }}
                        animate={phase === 'landed' ? {
                            scale: [0.8, 1.2, 1],
                        } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        {displayNumber}
                    </motion.div>

                    {/* Landing Indicator */}
                    {phase === 'landing' && (
                        <motion.div
                            className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                        >

                            <div className="text-green-500 font-mono text-sm">LANDING</div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Landing Burst */}
                <AnimatePresence>
                    {phase === 'landed' && (
                        <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 3, opacity: 0 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white"
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Status Messages */}
            <AnimatePresence>
                <motion.div
                    className="absolute bottom-32 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {phase === 'descending' && (
                        <p className="text-2xl text-[#C9A961]/80 font-light tracking-wide">
                            Descending...
                        </p>
                    )}
                    {phase === 'approaching' && (
                        <p className="text-2xl text-[#C9A961] font-medium tracking-wide">
                            Approaching selection...
                        </p>
                    )}
                    {phase === 'landing' && (
                        <p className="text-3xl text-[#C9A961] font-bold tracking-wide">
                            Finalizing selection
                        </p>
                    )}
                    {phase === 'landed' && (
                        <p className="text-4xl text-[#C9A961] font-bold tracking-wide">
                            Winner Selected
                        </p>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Corner HUD Elements */}
            <div className="absolute top-20 left-8 text-[#0EA5E9]/50 font-mono text-xs">
                <div>SYSTEM: ACTIVE</div>
                <div>MODE: AUTO</div>
                <div>STATUS: OK</div>
            </div>

            <div className="absolute bottom-20 right-8 text-[#0EA5E9]/50 font-mono text-xs text-right">
                <div>SPEED: {Math.floor(altitude / 10)} KTS</div>
                <div>HEADING: 270°</div>
                <div>WIND: 5 KTS</div>
            </div>

            {/* Horizon Line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0EA5E9]/20 to-transparent"></div>
        </div>
    );
};

export default FlightHUDPhase;

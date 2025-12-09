import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface GrandPrizePhaseProps {
    finalNumber: number;
    onComplete: () => void;
}

const GrandPrizePhase = ({ finalNumber, onComplete }: GrandPrizePhaseProps) => {
    const [phase, setPhase] = useState<'radar' | 'hack' | 'heartbeat' | 'explosion' | 'reveal'>('radar');
    const [displayText, setDisplayText] = useState('');
    const [showStatic, setShowStatic] = useState(false);
    const [radarAngle, setRadarAngle] = useState(0);
    const [heartbeatScale, setHeartbeatScale] = useState(1);

    const generateRandomText = () => {
        const chars = '0123456789ABCDEF';
        return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    useEffect(() => {
        const timeline = async () => {
            // Phase 1: Radar Scan (3s)
            setPhase('radar');
            const radarInterval = setInterval(() => {
                setRadarAngle(prev => (prev + 10) % 360);
            }, 50);

            await new Promise(resolve => setTimeout(resolve, 3000));
            clearInterval(radarInterval);

            // Phase 2: System Hack/Crash (2s)
            setPhase('hack');
            setShowStatic(true);
            await new Promise(resolve => setTimeout(resolve, 500));

            setShowStatic(false);
            const hackInterval = setInterval(() => {
                setDisplayText(generateRandomText());
            }, 100);

            await new Promise(resolve => setTimeout(resolve, 1500));
            clearInterval(hackInterval);

            // Another blackout
            setShowStatic(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            setShowStatic(false);

            // Phase 3: Heartbeat Pulse (2s)
            setPhase('heartbeat');
            const heartbeatInterval = setInterval(() => {
                setHeartbeatScale(prev => prev === 1 ? 1.1 : 1);
            }, 400);

            await new Promise(resolve => setTimeout(resolve, 2000));
            clearInterval(heartbeatInterval);

            // Phase 4: Explosion (1s)
            setPhase('explosion');
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Phase 5: Grand Reveal
            setPhase('reveal');
            setDisplayText(String(finalNumber));

            // MASSIVE Confetti
            const duration = 8000;
            const end = Date.now() + duration;
            const colors = ['#D4AF37', '#F4E4C1', '#14B8A6', '#0EA5E9', '#FF6B6B'];

            (function frame() {
                confetti({
                    particleCount: 20,
                    angle: 60,
                    spread: 100,
                    origin: { x: 0, y: 0.5 },
                    colors: colors,
                    startVelocity: 60,
                });
                confetti({
                    particleCount: 20,
                    angle: 120,
                    spread: 100,
                    origin: { x: 1, y: 0.5 },
                    colors: colors,
                    startVelocity: 60,
                });
                confetti({
                    particleCount: 15,
                    angle: 90,
                    spread: 120,
                    origin: { x: 0.5, y: 0.3 },
                    colors: colors,
                    startVelocity: 70,
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            })();

            setTimeout(() => onComplete(), 5000);
        };

        timeline();
    }, [finalNumber, onComplete]);

    return (
        <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#0A1628] via-[#1a0a2e] to-[#0A1628] flex flex-col items-center justify-center overflow-hidden">
            {/* Static Noise */}
            <AnimatePresence>
                {showStatic && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-black"
                        style={{
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
                            opacity: 0.6,
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Phase-specific content */}
            <AnimatePresence mode="wait">
                {/* RADAR PHASE */}
                {phase === 'radar' && (
                    <motion.div
                        key="radar"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative"
                    >
                        <h1 className="text-6xl font-black text-center mb-12"
                            style={{
                                background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            🏆 GRAND PRIZE DRAW 🏆
                        </h1>

                        {/* Radar Display */}
                        <div className="relative w-96 h-96">
                            {/* Radar Circles */}
                            {[200, 150, 100].map((size, i) => (
                                <div
                                    key={i}
                                    className="absolute top-1/2 left-1/2 rounded-full border-2 border-[#14B8A6]/30"
                                    style={{
                                        width: size * 2,
                                        height: size * 2,
                                        marginLeft: -size,
                                        marginTop: -size,
                                    }}
                                />
                            ))}

                            {/* Radar Sweep */}
                            <div
                                className="absolute top-1/2 left-1/2 origin-left h-1 bg-gradient-to-r from-[#14B8A6] to-transparent"
                                style={{
                                    width: 200,
                                    transform: `rotate(${radarAngle}deg)`,
                                    transformOrigin: 'left center',
                                }}
                            />

                            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-[#14B8A6] font-mono">
                                SCANNING...
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* HACK PHASE */}
                {phase === 'hack' && !showStatic && (
                    <motion.div
                        key="hack"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative"
                    >
                        <motion.div
                            className="text-9xl font-black text-red-500"
                            animate={{
                                x: [-10, 10, -10, 10, 0],
                                y: [-5, 5, -5, 5, 0],
                            }}
                            transition={{ duration: 0.1, repeat: Infinity }}
                        >
                            {displayText}
                        </motion.div>
                        <p className="text-3xl text-red-500 font-mono mt-8 animate-pulse">
                            ⚠️ SYSTEM BREACH DETECTED ⚠️
                        </p>
                    </motion.div>
                )}

                {/* HEARTBEAT PHASE */}
                {phase === 'heartbeat' && (
                    <motion.div
                        key="heartbeat"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative"
                    >
                        <motion.div
                            className="text-9xl"
                            animate={{ scale: heartbeatScale }}
                            transition={{ duration: 0.2 }}
                        >
                            💓
                        </motion.div>
                        <motion.div
                            className="absolute inset-0 rounded-full border-8 border-red-500"
                            animate={{
                                scale: [1, 2, 1],
                                opacity: [0.8, 0, 0.8],
                            }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        />
                    </motion.div>
                )}

                {/* EXPLOSION PHASE */}
                {phase === 'explosion' && (
                    <motion.div
                        key="explosion"
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 10, opacity: 0 }}
                        className="absolute inset-0 bg-white"
                    />
                )}

                {/* REVEAL PHASE */}
                {phase === 'reveal' && (
                    <motion.div
                        key="reveal"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
                        className="relative"
                    >
                        {/* Rays of Light */}
                        <div className="absolute inset-0 -z-10">
                            {[...Array(16)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute top-1/2 left-1/2 w-4 h-[600px] bg-gradient-to-t from-[#D4AF37]/60 to-transparent origin-bottom"
                                    style={{
                                        transform: `rotate(${i * 22.5}deg) translateY(-50%)`,
                                    }}
                                    animate={{
                                        opacity: [0.4, 0.8, 0.4],
                                        scale: [1, 1.1, 1],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                                />
                            ))}
                        </div>

                        <h1 className="text-6xl font-black text-center mb-8"
                            style={{
                                background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            🏆 GRAND PRIZE WINNER 🏆
                        </h1>

                        <motion.div
                            className="text-[15rem] font-black"
                            animate={{
                                textShadow: [
                                    '0 0 40px rgba(212, 175, 55, 0.5)',
                                    '0 0 80px rgba(212, 175, 55, 1)',
                                    '0 0 40px rgba(212, 175, 55, 0.5)',
                                ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{
                                background: 'linear-gradient(135deg, #D4AF37, #F4E4C1, #D4AF37)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {displayText}
                        </motion.div>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="text-5xl text-[#14B8A6] font-black text-center mt-8"
                        >
                            🎊 CONGRATULATIONS! 🎊
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GrandPrizePhase;

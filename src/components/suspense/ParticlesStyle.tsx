import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './suspense.css';

interface ParticlesStyleProps {
    finalNumber: number;
    onComplete: () => void;
    duration?: number;
}

const ParticlesStyle = ({ finalNumber, onComplete, duration = 6000 }: ParticlesStyleProps) => {
    const [displayNumber, setDisplayNumber] = useState(10000);
    const [phase, setPhase] = useState<'dispersed' | 'converging' | 'flare' | 'reveal'>('dispersed');

    useEffect(() => {
        let interval: number;

        const convergingStart = duration * 0.5;
        const flareStart = duration * 0.75;
        const revealStart = duration * 0.85;

        // Number cycling
        interval = window.setInterval(() => {
            setDisplayNumber(Math.floor(Math.random() * 90000) + 10000);
        }, 250);

        const convergingTimeout = window.setTimeout(() => {
            setPhase('converging');
        }, convergingStart);

        const flareTimeout = window.setTimeout(() => {
            setPhase('flare');
            clearInterval(interval);
        }, flareStart);

        const revealTimeout = window.setTimeout(() => {
            setPhase('reveal');
            setDisplayNumber(finalNumber);

            setTimeout(() => onComplete(), duration * 0.15);
        }, revealStart);

        return () => {
            clearInterval(interval);
            clearTimeout(convergingTimeout);
            clearTimeout(flareTimeout);
            clearTimeout(revealTimeout);
        };
    }, [finalNumber, onComplete, duration]);

    return (
        <div className="suspense-container particles-style">
            {/* Particle field */}
            <div className="particles-field">
                {[...Array(80)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="particle"
                        initial={{
                            x: (Math.random() - 0.5) * window.innerWidth,
                            y: (Math.random() - 0.5) * window.innerHeight,
                            opacity: 0.3,
                        }}
                        animate={{
                            x: phase === 'dispersed' || phase === 'converging'
                                ? [(Math.random() - 0.5) * window.innerWidth, (Math.random() - 0.5) * window.innerWidth]
                                : 0,
                            y: phase === 'dispersed' || phase === 'converging'
                                ? [(Math.random() - 0.5) * window.innerHeight, (Math.random() - 0.5) * window.innerHeight]
                                : 0,
                            opacity: phase === 'flare' ? [0.8, 0.3] : phase === 'reveal' ? 0.1 : 0.5,
                            scale: phase === 'flare' ? [1, 1.5, 0.5] : 1,
                        }}
                        transition={{
                            duration: phase === 'dispersed' ? 3 : phase === 'converging' ? 2 : 1,
                            repeat: phase === 'dispersed' || phase === 'converging' ? Infinity : 0,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Central glow */}
            <motion.div
                className="central-glow"
                animate={{
                    opacity: phase === 'converging' ? [0.2, 0.6] : phase === 'flare' ? 0.8 : 0.3,
                    scale: phase === 'flare' ? [1, 1.5, 1] : 1,
                }}
                transition={{ duration: 1.5 }}
            />

            {/* Number display */}
            <motion.div
                className="number-display"
                animate={{
                    scale: phase === 'reveal' ? [0.9, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.6 }}
            >
                <motion.div
                    className="number"
                    style={{
                        color: phase === 'reveal' ? '#E2C78A' : '#6ba3ff',
                        filter: phase === 'reveal' ? 'blur(0px)' : 'blur(1.5px)',
                    }}
                >
                    {displayNumber}
                </motion.div>
            </motion.div>

            {/* Status text */}
            <motion.div className="status-text">
                {phase === 'dispersed' && 'Scanning field...'}
                {phase === 'converging' && 'Converging on winner...'}
                {phase === 'flare' && 'Locking selection...'}
                {phase === 'reveal' && 'Winner Selected'}
            </motion.div>
        </div>
    );
};

export default ParticlesStyle;

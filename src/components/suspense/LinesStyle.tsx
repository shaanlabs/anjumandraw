import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './suspense.css';

interface LinesStyleProps {
    finalNumber: number;
    onComplete: () => void;
    duration?: number;
}

const LinesStyle = ({ finalNumber, onComplete, duration = 6000 }: LinesStyleProps) => {
    const [displayNumber, setDisplayNumber] = useState(10000);
    const [phase, setPhase] = useState<'scanning' | 'locking' | 'reveal'>('scanning');

    useEffect(() => {
        let interval: number;
        let timeout: number;

        const lockingStart = duration * 0.6;
        const revealStart = duration * 0.85;

        interval = window.setInterval(() => {
            setDisplayNumber(Math.floor(Math.random() * 90000) + 10000);
        }, 150);

        timeout = window.setTimeout(() => {
            setPhase('locking');
            clearInterval(interval);

            interval = window.setInterval(() => {
                setDisplayNumber(Math.floor(Math.random() * 90000) + 10000);
            }, 400);
        }, lockingStart);

        const revealTimeout = window.setTimeout(() => {
            setPhase('reveal');
            clearInterval(interval);
            setDisplayNumber(finalNumber);

            setTimeout(() => {
                onComplete();
            }, duration * 0.15);
        }, revealStart);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
            clearTimeout(revealTimeout);
        };
    }, [finalNumber, onComplete, duration]);

    return (
        <div className="suspense-container lines-style">
            <div className="lines-bg">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="line"
                        style={{
                            left: `${(i / 12) * 100}%`,
                            height: `${30 + Math.random() * 40}%`,
                        }}
                        animate={{
                            height: phase === 'locking'
                                ? [`${30 + Math.random() * 40}%`, `${50}%`]
                                : [`${20 + Math.random() * 60}%`, `${30 + Math.random() * 40}%`],
                            opacity: phase === 'reveal' ? 0.3 : [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: phase === 'locking' ? 2 : 1.5,
                            repeat: phase !== 'reveal' ? Infinity : 0,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            <div className="bars-container">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="bar"
                        initial={{ scaleX: 0 }}
                        animate={{
                            scaleX: phase === 'locking' ? 1 : [0, 1, 0],
                            x: phase === 'reveal' ? [0, 100] : 0,
                        }}
                        transition={{
                            duration: 2,
                            repeat: phase !== 'reveal' ? Infinity : 0,
                            delay: i * 0.2,
                        }}
                        style={{ top: `${20 + i * 15}%` }}
                    />
                ))}
            </div>

            <motion.div
                className="number-display"
                animate={{
                    scale: phase === 'reveal' ? [0.95, 1.05, 1] : 1,
                    filter: phase === 'scanning' || phase === 'locking'
                        ? 'blur(2px)'
                        : 'blur(0px)',
                }}
                transition={{
                    scale: { duration: 0.6 },
                    filter: { duration: 0.4 },
                }}
            >
                <motion.div
                    className="number"
                    key={displayNumber}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: phase === 'reveal' ? 1 : 0.8 }}
                    style={{
                        color: phase === 'reveal' ? '#E2C78A' : '#6ba3ff',
                    }}
                >
                    {displayNumber}
                </motion.div>
            </motion.div>

            <motion.div
                className="status-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {phase === 'scanning' && 'Scanning entries...'}
                {phase === 'locking' && 'Selecting winner...'}
                {phase === 'reveal' && 'Winner Selected'}
            </motion.div>
        </div>
    );
};

export default LinesStyle;

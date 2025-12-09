import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './suspense.css';

interface DigitsStyleProps {
    finalNumber: number;
    onComplete: () => void;
    duration?: number;
}

const DigitsStyle = ({ finalNumber, onComplete, duration = 6000 }: DigitsStyleProps) => {
    const [displayNumber, setDisplayNumber] = useState(10000);
    const [phase, setPhase] = useState<'scanning' | 'narrowing' | 'reveal'>('scanning');

    useEffect(() => {
        let interval: number;

        const narrowingStart = duration * 0.6;
        const revealStart = duration * 0.85;

        // Rapid number cycling
        interval = window.setInterval(() => {
            setDisplayNumber(Math.floor(Math.random() * 90000) + 10000);
        }, 120);

        const narrowingTimeout = window.setTimeout(() => {
            setPhase('narrowing');
            clearInterval(interval);

            // Slower cycling
            interval = window.setInterval(() => {
                setDisplayNumber(Math.floor(Math.random() * 90000) + 10000);
            }, 350);
        }, narrowingStart);

        const revealTimeout = window.setTimeout(() => {
            setPhase('reveal');
            clearInterval(interval);
            setDisplayNumber(finalNumber);

            setTimeout(() => onComplete(), duration * 0.15);
        }, revealStart);

        return () => {
            clearInterval(interval);
            clearTimeout(narrowingTimeout);
            clearTimeout(revealTimeout);
        };
    }, [finalNumber, onComplete, duration]);

    return (
        <div className="suspense-container digits-style">
            {/* Background digit matrix */}
            <div className="digit-matrix">
                {[...Array(150)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="bg-digit"
                        initial={{ opacity: 0.1 }}
                        animate={{
                            opacity: phase === 'reveal' ? 0.05 : [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: phase !== 'reveal' ? Infinity : 0,
                            delay: Math.random() * 2,
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    >
                        {Math.floor(Math.random() * 10)}
                    </motion.div>
                ))}
            </div>

            {/* Highlight bars */}
            {phase === 'narrowing' && (
                <div className="highlight-bars">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="highlight-bar"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: [0, 1, 0] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.3,
                            }}
                            style={{ left: `${30 + i * 20}%` }}
                        />
                    ))}
                </div>
            )}

            {/* Main number display */}
            <motion.div
                className="number-display"
                animate={{
                    scale: phase === 'reveal' ? [0.95, 1.05, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="number"
                    style={{
                        color: phase === 'reveal' ? '#E2C78A' : '#6ba3ff',
                        filter: phase === 'scanning'
                            ? 'blur(3px)'
                            : phase === 'narrowing'
                                ? 'blur(1.5px)'
                                : 'blur(0px)',
                    }}
                >
                    {displayNumber}
                </motion.div>
            </motion.div>

            {/* Status text */}
            <motion.div className="status-text">
                {phase === 'scanning' && 'Processing entries...'}
                {phase === 'narrowing' && 'Narrowing selection...'}
                {phase === 'reveal' && 'Winner Selected'}
            </motion.div>
        </div>
    );
};

export default DigitsStyle;

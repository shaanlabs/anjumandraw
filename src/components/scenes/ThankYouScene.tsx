import { motion } from 'framer-motion';
import { useDrawContext } from '../../context/DrawContext';
import './scenes.css';

const ThankYouScene = () => {
    const { winners } = useDrawContext();

    return (
        <div className="scene thank-you-scene">
            {/* Main thank you message */}
            <motion.div
                className="thank-you-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                <motion.h1
                    className="thank-you-title"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                >
                    Thank You
                </motion.h1>

                <motion.p
                    className="thank-you-subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    {winners.length} {winners.length === 1 ? 'Prize' : 'Prizes'} Awarded
                </motion.p>

                <motion.div
                    className="thank-you-message"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                >
                    Ceremony Complete
                </motion.div>
            </motion.div>

            {/* Subtle background glow */}
            <motion.div
                className="thank-you-glow"
                animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </div>
    );
};

export default ThankYouScene;

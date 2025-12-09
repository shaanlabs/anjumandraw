import { motion } from 'framer-motion';
import { useDrawContext } from '../../context/DrawContext';
import './scenes.css';

const RevealScene = () => {
    const { currentWinner } = useDrawContext();

    if (!currentWinner) {
        return (
            <div className="scene reveal-scene">
                <p style={{ color: '#9CA3AF' }}>No winner to display</p>
            </div>
        );
    }

    return (
        <div className="scene reveal-scene">
            {/* Subtle radial glow behind number */}
            <motion.div
                className="reveal-glow"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.3, 0.6, 0.3], scale: 1 }}
                transition={{
                    opacity: { duration: 3, repeat: Infinity },
                    scale: { duration: 0.6 }
                }}
            />

            {/* Content */}
            <motion.div
                className="reveal-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
            >
                {/* Prize Label */}
                <motion.p
                    className="prize-label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Prize #{currentWinner.prizeNumber} Winner
                </motion.p>

                {/* Winner Number - Large and Clear */}
                <motion.div
                    className="winner-number"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        duration: 0.6,
                        delay: 0.7,
                        type: "spring",
                        stiffness: 100
                    }}
                >
                    {currentWinner.ticketNumber}
                </motion.div>

                {/* Ticket Label */}
                <motion.p
                    className="ticket-label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    Ticket Number
                </motion.p>
            </motion.div>
        </div>
    );
};

export default RevealScene;

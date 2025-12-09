import { motion } from 'framer-motion';
import { useDrawContext } from '../../context/DrawContext';
import './scenes.css';

const WinnersWallScene = () => {
    const { winners } = useDrawContext();

    if (winners.length === 0) {
        return (
            <div className="scene winners-wall">
                <p style={{ color: '#9CA3AF', fontSize: '1.5rem' }}>
                    No winners yet
                </p>
            </div>
        );
    }

    return (
        <div className="scene winners-wall">
            <motion.div
                className="winners-wall-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1>Winners</h1>
                <p>{winners.length} {winners.length === 1 ? 'Prize' : 'Prizes'} Drawn</p>
            </motion.div>

            <div className="winners-grid">
                {winners.map((winner, index) => (
                    <motion.div
                        key={index}
                        className="winner-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            delay: index * 0.1,
                            duration: 0.4,
                        }}
                    >
                        <div className="winner-card-prize">
                            Prize #{winner.prizeNumber}
                        </div>
                        <div className="winner-card-number">
                            {winner.ticketNumber}
                        </div>
                        <div className="winner-card-time">
                            {new Date(winner.timestamp).toLocaleTimeString()}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default WinnersWallScene;

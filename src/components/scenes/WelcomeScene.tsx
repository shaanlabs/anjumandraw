import { motion } from 'framer-motion';
import './scenes.css';

const WelcomeScene = () => {
    return (
        <div className="scene welcome-scene">
            {/* Slow gradient background animation */}
            <motion.div
                className="gradient-bg"
                animate={{
                    backgroundPosition: ['0% 50%', '100% 50%'],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: 'reverse',
                }}
            />

            {/* Content */}
            <motion.div
                className="welcome-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <h1 className="event-title">ANJUMAN BHATKAL</h1>
                <p className="event-subtitle">Digital Lucky Draw</p>
                <p className="event-message">Session will begin shortly</p>
            </motion.div>
        </div>
    );
};

export default WelcomeScene;

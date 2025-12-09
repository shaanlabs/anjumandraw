import { motion } from 'framer-motion';
import './scenes.css';

interface CurtainSceneProps {
    state: 'closed' | 'opening';
}

const CurtainScene = ({ state }: CurtainSceneProps) => {
    return (
        <div className="scene curtain-scene">
            {/* Left curtain */}
            <motion.div
                className="curtain curtain-left"
                initial={{ x: 0 }}
                animate={{
                    x: state === 'opening' ? '-100%' : 0
                }}
                transition={{
                    duration: 3.5,
                    ease: [0.43, 0.13, 0.23, 0.96] // Custom easing for theatrical feel
                }}
            />

            {/* Right curtain */}
            <motion.div
                className="curtain curtain-right"
                initial={{ x: 0 }}
                animate={{
                    x: state === 'opening' ? '100%' : 0
                }}
                transition={{
                    duration: 3.5,
                    ease: [0.43, 0.13, 0.23, 0.96]
                }}
            />

            {/* Subtle hint text (only when closed) */}
            {state === 'closed' && (
                <motion.div
                    className="curtain-hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.6, 0.6, 0] }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatDelay: 2
                    }}
                >
                    Press any key to begin
                </motion.div>
            )}
        </div>
    );
};

export default CurtainScene;

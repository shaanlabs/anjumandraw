import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DigitRollerProps {
    value: number;
    isRolling: boolean;
    digitIndex: number;
}

const DigitRoller = ({ value, isRolling, digitIndex }: DigitRollerProps) => {
    const [displayDigit, setDisplayDigit] = useState(value);
    const [isBlurred, setIsBlurred] = useState(false);

    useEffect(() => {
        if (isRolling) {
            setIsBlurred(true);
            // Each digit rolls at slightly different speed for cascading effect
            const delay = digitIndex * 100;
            const rollInterval = setInterval(() => {
                setDisplayDigit(Math.floor(Math.random() * 10));
            }, 50 + delay);

            return () => clearInterval(rollInterval);
        } else {
            setDisplayDigit(value);
            setIsBlurred(false);
        }
    }, [isRolling, value, digitIndex]);

    return (
        <motion.div
            className="relative inline-block"
            animate={isRolling ? {
                y: [0, -5, 0],
            } : {}}
            transition={{
                duration: 0.15,
                repeat: isRolling ? Infinity : 0,
                ease: 'easeInOut',
            }}
        >
            <div
                className={`
          text-7xl md:text-9xl lg:text-[12rem] font-black
          bg-gradient-to-b from-gold-300 via-gold-400 to-gold-600
          bg-clip-text text-transparent
          transition-all duration-150
          ${isBlurred ? 'blur-sm scale-105' : 'blur-0 scale-100'}
        `}
                style={{
                    fontFamily: '"Outfit", sans-serif',
                    textShadow: isBlurred
                        ? '0 0 20px rgba(251, 191, 36, 0.8)'
                        : '0 4px 12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(251, 191, 36, 0.4)',
                    letterSpacing: '0.05em',
                }}
            >
                {displayDigit}
            </div>
        </motion.div>
    );
};

interface SlotMachineNumberProps {
    number: number;
    isRolling: boolean;
}

const SlotMachineNumber = ({ number, isRolling }: SlotMachineNumberProps) => {
    const digits = number.toString().padStart(5, '0').split('');

    return (
        <div className="flex gap-2 md:gap-4 justify-center items-center">
            {digits.map((digit, index) => (
                <DigitRoller
                    key={index}
                    value={parseInt(digit)}
                    isRolling={isRolling}
                    digitIndex={index}
                />
            ))}
        </div>
    );
};

export default SlotMachineNumber;

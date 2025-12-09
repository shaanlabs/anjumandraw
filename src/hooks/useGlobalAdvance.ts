import { useEffect } from 'react';

interface UseGlobalAdvanceProps {
    onAdvance: () => void;
    debounceMs?: number;
}

// Track last advance time to prevent double-triggers
let lastAdvanceTime = 0;

export const useGlobalAdvance = ({ onAdvance, debounceMs = 500 }: UseGlobalAdvanceProps) => {
    useEffect(() => {
        const handleAdvance = () => {
            const now = Date.now();

            // Debounce: prevent multiple triggers within debounceMs
            if (now - lastAdvanceTime < debounceMs) {
                return;
            }

            lastAdvanceTime = now;
            onAdvance();
        };

        // Keyboard listener
        const handleKeyDown = (e: KeyboardEvent) => {
            const advanceKeys = ['Space', 'Enter', 'ArrowRight', 'PageDown'];

            if (advanceKeys.includes(e.code) || e.key === ' ' || e.key === 'Enter') {
                e.preventDefault(); // Prevent page scroll on space
                handleAdvance();
            }
        };

        // Mouse click listener
        const handleClick = () => {
            handleAdvance();
        };

        // Touch listener (for tablets/phones)
        const handleTouch = () => {
            handleAdvance();
        };

        // Add all listeners
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('click', handleClick);
        document.addEventListener('touchstart', handleTouch);

        // Cleanup
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('click', handleClick);
            document.removeEventListener('touchstart', handleTouch);
        };
    }, [onAdvance, debounceMs]);
};

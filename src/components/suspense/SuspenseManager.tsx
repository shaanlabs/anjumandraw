import { useState, useEffect } from 'react';
import LinesStyle from './LinesStyle';
import ParticlesStyle from './ParticlesStyle';
import DigitsStyle from './DigitsStyle';

type SuspenseStyleType = 'lines' | 'particles' | 'digits';

interface SuspenseManagerProps {
    finalNumber: number;
    onComplete: () => void;
    duration?: number;
}

// Track last used style to avoid repetition
let lastUsedStyle: SuspenseStyleType | null = null;

const SuspenseManager = ({ finalNumber, onComplete, duration = 6000 }: SuspenseManagerProps) => {
    const [selectedStyle, setSelectedStyle] = useState<SuspenseStyleType>('lines');

    useEffect(() => {
        // Pick random style, avoiding the last one used
        const styles: SuspenseStyleType[] = ['lines', 'particles', 'digits'];
        const availableStyles = lastUsedStyle
            ? styles.filter(s => s !== lastUsedStyle)
            : styles;

        const randomStyle = availableStyles[Math.floor(Math.random() * availableStyles.length)];
        setSelectedStyle(randomStyle);
        lastUsedStyle = randomStyle;
    }, [finalNumber]); // Re-select when finalNumber changes (new draw)

    // Render the selected style
    switch (selectedStyle) {
        case 'lines':
            return <LinesStyle finalNumber={finalNumber} onComplete={onComplete} duration={duration} />;
        case 'particles':
            return <ParticlesStyle finalNumber={finalNumber} onComplete={onComplete} duration={duration} />;
        case 'digits':
            return <DigitsStyle finalNumber={finalNumber} onComplete={onComplete} duration={duration} />;
    }
};

export default SuspenseManager;

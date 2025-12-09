// Animation constants for easy customization
export const ANIMATION_DURATIONS = {
    normalRoll: 6000, // 6 seconds for normal prizes
    firstPrizeRoll: 12000, // 12 seconds for first prize
    countdownTick: 1000,
    confettiDuration: 3000,
    digitRollSpeed: 50, // ms per digit change
    fadeIn: 500,
    slideDown: 600,
    bounce: 800,
};

export const COLORS = {
    primary: {
        navy: '#0a1628',
        navyLight: '#1a2744',
        navyDark: '#050b14',
    },
    accent: {
        gold: '#fbbf24',
        goldLight: '#fcd34d',
        goldDark: '#f59e0b',
        orange: '#fb923c',
        neon: '#06b6d4',
    },
    glow: {
        gold: 'rgba(251, 191, 36, 0.5)',
        blue: 'rgba(6, 182, 212, 0.3)',
        white: 'rgba(255, 255, 255, 0.2)',
    },
};

export const EASING = {
    easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
    easeInOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

// Sound hooks (to be implemented)
export const soundHooks = {
    onRollingStart: () => console.log('🎵 Drum roll start'),
    onRollingPeak: () => console.log('🎵 Drum roll peak'),
    onWinnerReveal: () => console.log('🎵 Fanfare!'),
    onCountdownTick: () => console.log('🎵 Tick'),
};

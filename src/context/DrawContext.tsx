import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Winner {
    prizeNumber: number;
    ticketNumber: number;
    timestamp: Date;
}

export interface DrawSettings {
    numberOfPrizes: number;
    ticketStart: number;
    ticketEnd: number;
    countdownSeconds: number;
    enableCountdown: boolean;
    allowDuplicates: boolean;
    minGap: number;
    prizeOrder: 'ascending' | 'descending'; // NEW: Prize 1,2,3 or 3,2,1
    enableSound: boolean;
    theme: 'blue-gold' | 'green-gold' | 'purple-neon';
    customMessage: string;
    demoMode: boolean;
}

export type DrawStatus = 'idle' | 'countdown' | 'drawing' | 'winner-display' | 'paused';
export type PhaseType = 'radar' | 'flight' | 'flightRadar' | null;
export type Scene = 'curtain-closed' | 'curtain-opening' | 'ready' | 'suspense' | 'reveal' | 'winners-wall' | 'thank-you';

interface DrawContextType {
    settings: DrawSettings;
    updateSettings: (settings: Partial<DrawSettings>) => void;
    winners: Winner[];
    currentWinner: Winner | null;
    drawStatus: DrawStatus;
    currentPhase: PhaseType;
    currentScene: Scene;
    setCurrentScene: (scene: Scene) => void;
    countdownValue: number;
    showFullScreen: boolean;
    startDraw: () => void;
    drawNextWinner: () => void;
    completePhase: () => void;
    resetAll: () => void;
    toggleFullScreen: () => void;
    exportWinners: () => void;
    copyWinners: () => void;
    pauseDraw: () => void;
    resumeDraw: () => void;
    advanceState: () => void;
}

const DrawContext = createContext<DrawContextType | undefined>(undefined);

export const useDrawContext = () => {
    const context = useContext(DrawContext);
    if (!context) {
        throw new Error('useDrawContext must be used within DrawProvider');
    }
    return context;
};

interface DrawProviderProps {
    children: ReactNode;
}


export const DrawProvider: React.FC<DrawProviderProps> = ({ children }) => {
    // Load settings from localStorage or use defaults
    const getInitialSettings = (): DrawSettings => {
        try {
            const saved = localStorage.getItem('luckyDrawSettings');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Failed to load settings from localStorage:', error);
        }

        // Default settings
        return {
            numberOfPrizes: 5,
            ticketStart: 1,
            ticketEnd: 500,
            countdownSeconds: 10,
            enableCountdown: true,
            allowDuplicates: false,
            minGap: 0,
            prizeOrder: 'ascending',
            enableSound: true,
            theme: 'blue-gold',
            customMessage: 'Welcome to Anjuman Day Celebration',
            demoMode: false,
        };
    };

    const [settings, setSettings] = useState<DrawSettings>(getInitialSettings());

    const [winners, setWinners] = useState<Winner[]>([]);
    const [currentWinner, setCurrentWinner] = useState<Winner | null>(null);
    const [drawStatus, setDrawStatus] = useState<DrawStatus>('idle');
    const [currentPhase, setCurrentPhase] = useState<PhaseType>(null);
    const [currentScene, setCurrentScene] = useState<Scene>('curtain-closed');
    const [countdownValue, setCountdownValue] = useState(0);
    const [showFullScreen, setShowFullScreen] = useState(false);

    let previousPhase: PhaseType = null;

    const selectRandomPhase = (): PhaseType => {
        const phases: PhaseType[] = ['radar', 'flight', 'flightRadar'];
        let selected = phases[Math.floor(Math.random() * phases.length)];

        if (selected === previousPhase && phases.length > 1) {
            const otherPhases = phases.filter(p => p !== previousPhase);
            selected = otherPhases[Math.floor(Math.random() * otherPhases.length)];
        }

        previousPhase = selected;
        return selected;
    };

    const updateSettings = (newSettings: Partial<DrawSettings>) => {
        setSettings((prev) => {
            const updated = { ...prev, ...newSettings };
            // Save to localStorage
            try {
                localStorage.setItem('luckyDrawSettings', JSON.stringify(updated));
            } catch (error) {
                console.error('Failed to save settings to localStorage:', error);
            }
            return updated;
        });
    };

    const getRandomTicket = (): number => {
        const { ticketStart, ticketEnd, allowDuplicates } = settings;
        const usedTickets = new Set(winners.map(w => w.ticketNumber));

        // Stratified Sampling: Divide range into segments for even distribution
        const totalTickets = ticketEnd - ticketStart + 1;
        const numberOfPrizes = settings.numberOfPrizes;
        const segmentSize = Math.floor(totalTickets / numberOfPrizes);

        // Determine which segment this draw should come from
        const currentSegment = winners.length;
        const segmentStart = ticketStart + (currentSegment * segmentSize);
        const segmentEnd = currentSegment === numberOfPrizes - 1
            ? ticketEnd  // Last segment gets remainder
            : segmentStart + segmentSize - 1;

        // Build available tickets in this segment
        const availableInSegment = [];
        for (let i = segmentStart; i <= segmentEnd; i++) {
            if (allowDuplicates || !usedTickets.has(i)) {
                availableInSegment.push(i);
            }
        }

        // If segment is exhausted, fall back to any available ticket
        if (availableInSegment.length === 0) {
            const availableTickets = [];
            for (let i = ticketStart; i <= ticketEnd; i++) {
                if (allowDuplicates || !usedTickets.has(i)) {
                    availableTickets.push(i);
                }
            }

            if (availableTickets.length === 0) {
                throw new Error('No more unique tickets available!');
            }

            return availableTickets[Math.floor(Math.random() * availableTickets.length)];
        }

        // Pick random ticket from this segment
        return availableInSegment[Math.floor(Math.random() * availableInSegment.length)];
    };

    const startDraw = () => {
        if (winners.length >= settings.numberOfPrizes) {
            alert('All prizes have been drawn!');
            return;
        }

        try {
            const ticketNumber = getRandomTicket();

            // Calculate prize number based on order setting
            let prizeNumber: number;
            if (settings.prizeOrder === 'descending') {
                // Descending: Start from highest (e.g., 5, 4, 3, 2, 1)
                prizeNumber = settings.numberOfPrizes - winners.length;
            } else {
                // Ascending: Start from lowest (e.g., 1, 2, 3, 4, 5)
                prizeNumber = winners.length + 1;
            }

            const tempWinner: Winner = {
                prizeNumber,
                ticketNumber,
                timestamp: new Date(),
            };
            setCurrentWinner(tempWinner);

            const phase = selectRandomPhase();
            setCurrentPhase(phase);

            setDrawStatus('drawing');
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Error starting draw');
        }
    };

    const completePhase = () => {
        if (currentWinner) {
            setWinners((prev) => [...prev, currentWinner]);
            setDrawStatus('winner-display');
        }
    };

    const drawNextWinner = () => {
        setCurrentWinner(null);
        setDrawStatus('idle');
        setTimeout(() => {
            startDraw();
        }, 500);
    };

    const resetAll = () => {
        if (winners.length > 0) {
            const confirmed = window.confirm('Are you sure you want to reset?');
            if (!confirmed) return;
        }

        setWinners([]);
        setCurrentWinner(null);
        setDrawStatus('idle');
        setCountdownValue(0);
        setShowFullScreen(false);
        setCurrentScene('curtain-closed');
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        setShowFullScreen((prev) => !prev);
    };

    const exportWinners = () => {
        if (winners.length === 0) {
            alert('No winners to export!');
            return;
        }

        const csvContent = [
            ['Prize #', 'Ticket Number', 'Time'],
            ...winners.map((w) => [
                w.prizeNumber,
                w.ticketNumber,
                w.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            ]),
        ]
            .map((row) => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lucky-draw-winners-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const copyWinners = () => {
        if (winners.length === 0) {
            alert('No winners to copy!');
            return;
        }

        const text = winners
            .map((w) => `Prize #${w.prizeNumber}: Ticket ${w.ticketNumber}`)
            .join('\n');

        navigator.clipboard.writeText(text).then(() => {
            alert('Winners copied to clipboard!');
        });
    };

    const pauseDraw = () => {
        console.log('Pause functionality - to be implemented');
    };

    const resumeDraw = () => {
        console.log('Resume functionality - to be implemented');
    };

    const advanceState = () => {
        if (currentScene === 'curtain-closed') {
            setCurrentScene('curtain-opening');
            setTimeout(() => {
                setCurrentScene('ready');
            }, 3500);
        } else if (currentScene === 'curtain-opening') {
            return;
        } else if (currentScene === 'ready') {
            if (winners.length < settings.numberOfPrizes) {
                drawNextWinner();
                setCurrentScene('suspense');
            }
        } else if (currentScene === 'suspense') {
            return;
        } else if (currentScene === 'reveal') {
            if (winners.length < settings.numberOfPrizes) {
                drawNextWinner();
                setCurrentScene('suspense');
            } else {
                setCurrentScene('thank-you');
            }
        } else if (currentScene === 'winners-wall') {
            setCurrentScene('thank-you');
        } else if (currentScene === 'thank-you') {
            setCurrentScene('curtain-closed');
        }
    };

    return (
        <DrawContext.Provider
            value={{
                settings,
                updateSettings,
                winners,
                currentWinner,
                drawStatus,
                currentPhase,
                currentScene,
                setCurrentScene,
                countdownValue,
                showFullScreen,
                startDraw,
                drawNextWinner,
                completePhase,
                resetAll,
                toggleFullScreen,
                exportWinners,
                copyWinners,
                pauseDraw,
                resumeDraw,
                advanceState,
            }}
        >
            {children}
        </DrawContext.Provider>
    );
};

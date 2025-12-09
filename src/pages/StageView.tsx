import { useDrawContext } from '../context/DrawContext';
import { useGlobalAdvance } from '../hooks/useGlobalAdvance';
import CurtainScene from '../components/scenes/CurtainScene';
import WelcomeScene from '../components/scenes/WelcomeScene';
import RevealScene from '../components/scenes/RevealScene';
import WinnersWallScene from '../components/scenes/WinnersWallScene';
import ThankYouScene from '../components/scenes/ThankYouScene';
import SuspenseManager from '../components/suspense/SuspenseManager';
import './StageView.css';

const StageView = () => {
    const { currentScene, currentWinner, setCurrentScene, winners, advanceState, completePhase } = useDrawContext();

    // Global auto-advance: ANY key, click, or touch advances ceremony
    useGlobalAdvance({
        onAdvance: advanceState,
        debounceMs: 600,
    });

    const handleSuspenseComplete = () => {
        completePhase(); // Save the winner to the winners array
        setCurrentScene('reveal');
    };

    return (
        <div className="stage-view">
            <div className="scene-container">
                {/* Curtain States */}
                {currentScene === 'curtain-closed' && <CurtainScene state="closed" />}
                {currentScene === 'curtain-opening' && <CurtainScene state="opening" />}

                {/* Ready State (standby after curtain opens) */}
                {currentScene === 'ready' && <WelcomeScene />}

                {/* Suspense */}
                {currentScene === 'suspense' && currentWinner && (
                    <SuspenseManager
                        finalNumber={currentWinner.ticketNumber}
                        onComplete={handleSuspenseComplete}
                        duration={6000}
                    />
                )}

                {/* Reveal */}
                {currentScene === 'reveal' && <RevealScene />}

                {/* Winners Wall */}
                {currentScene === 'winners-wall' && <WinnersWallScene />}

                {/* Thank You End Scene */}
                {currentScene === 'thank-you' && <ThankYouScene />}
            </div>

            {/* Winners Sidebar - Only show during active ceremony, not during curtain or thank you */}
            {!['curtain-closed', 'curtain-opening', 'winners-wall', 'thank-you'].includes(currentScene) && (
                <aside className="winners-sidebar">
                    <h3>Winners</h3>
                    <div className="winners-list">
                        {winners.length === 0 ? (
                            <p className="no-winners-msg">No winners yet</p>
                        ) : (
                            winners.slice().reverse().map((winner, idx) => (
                                <div key={idx} className="sidebar-winner">
                                    <div className="sidebar-prize">Prize #{winner.prizeNumber}</div>
                                    <div className="sidebar-ticket">{winner.ticketNumber}</div>
                                    <div className="sidebar-time">
                                        {new Date(winner.timestamp).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="advance-hint">
                        Press any key to advance
                    </div>
                </aside>
            )}
        </div>
    );
};

export default StageView;

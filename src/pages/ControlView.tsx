import { useState, useEffect } from 'react';
import { useDrawContext } from '../context/DrawContext';
import './ControlView.css';

const ControlView = () => {
    const {
        setCurrentScene,
        startDraw,
        winners,
        settings,
        updateSettings,
        resetAll,
        currentScene
    } = useDrawContext();

    // Local state for configuration editing - sync with context settings
    const [ticketStart, setTicketStart] = useState(settings.ticketStart);
    const [ticketEnd, setTicketEnd] = useState(settings.ticketEnd);
    const [numberOfPrizes, setNumberOfPrizes] = useState(settings.numberOfPrizes);
    const [prizeOrder, setPrizeOrder] = useState<'ascending' | 'descending'>(settings.prizeOrder);

    // Sync local state when settings change in context
    useEffect(() => {
        setTicketStart(settings.ticketStart);
        setTicketEnd(settings.ticketEnd);
        setNumberOfPrizes(settings.numberOfPrizes);
        setPrizeOrder(settings.prizeOrder);
    }, [settings]);

    const handleSaveSettings = () => {
        updateSettings({
            ticketStart,
            ticketEnd,
            numberOfPrizes,
            prizeOrder,
            minGap: 0,
        });
        alert('✅ Settings saved successfully!');
    };

    const handleStartDraw = () => {
        if (winners.length >= settings.numberOfPrizes) {
            alert('All prizes have been drawn!');
            return;
        }
        setCurrentScene('suspense');
        startDraw();
    };

    const handleReset = () => {
        if (confirm('⚠️ Are you sure? This will clear all winners and reset to curtain.')) {
            resetAll();
            setCurrentScene('curtain-closed');
        }
    };

    // DEBUG: Log winners to console
    console.log('🎯 ControlView - Winners Count:', winners.length, 'Winners:', winners);

    return (
        <div className="control-view">
            {/* Header */}
            <header className="control-header">
                <h1>Control Panel</h1>
                <p className="control-subtitle">Professional Lucky Draw System</p>
            </header>

            <main className="control-main">
                {/* Configuration Section */}
                <section className="control-section config-section">
                    <h2>⚙️ Configuration</h2>

                    <div className="config-grid">
                        <div className="config-group">
                            <label>Ticket Range Start</label>
                            <input
                                type="number"
                                value={ticketStart}
                                onChange={(e) => setTicketStart(Number(e.target.value))}
                                className="config-input"
                                placeholder="e.g., 1"
                            />
                        </div>

                        <div className="config-group">
                            <label>Ticket Range End</label>
                            <input
                                type="number"
                                value={ticketEnd}
                                onChange={(e) => setTicketEnd(Number(e.target.value))}
                                className="config-input"
                                placeholder="e.g., 500"
                            />
                        </div>

                        <div className="config-group">
                            <label>Number of Prizes</label>
                            <input
                                type="number"
                                value={numberOfPrizes}
                                onChange={(e) => setNumberOfPrizes(Number(e.target.value))}
                                min="1"
                                max="50"
                                className="config-input"
                                placeholder="e.g., 5"
                            />
                        </div>

                        <div className="config-group">
                            <label>Prize Order</label>
                            <select
                                value={prizeOrder}
                                onChange={(e) => setPrizeOrder(e.target.value as 'ascending' | 'descending')}
                                className="config-input"
                            >
                                <option value="ascending">Ascending (1 → 2 → 3)</option>
                                <option value="descending">Descending (3 → 2 → 1)</option>
                            </select>
                        </div>
                    </div>

                    <button onClick={handleSaveSettings} className="save-btn">
                        💾 Save Configuration
                    </button>
                </section>

                {/* Scene Control Section */}
                <section className="control-section">
                    <h2>🎬 Scene Control</h2>
                    <div className="scene-buttons">
                        <button
                            onClick={() => setCurrentScene('curtain-closed')}
                            className={`scene-btn ${currentScene === 'curtain-closed' ? 'active' : ''}`}
                        >
                            Curtain
                        </button>
                        <button
                            onClick={() => setCurrentScene('ready')}
                            className={`scene-btn ${currentScene === 'ready' ? 'active' : ''}`}
                        >
                            Ready
                        </button>
                        <button
                            onClick={() => setCurrentScene('reveal')}
                            className={`scene-btn ${currentScene === 'reveal' ? 'active' : ''}`}
                            disabled={!winners.length}
                        >
                            Reveal
                        </button>
                        <button
                            onClick={() => setCurrentScene('winners-wall')}
                            className={`scene-btn ${currentScene === 'winners-wall' ? 'active' : ''}`}
                            disabled={winners.length === 0}
                        >
                            Winners Wall
                        </button>
                        <button
                            onClick={() => setCurrentScene('thank-you')}
                            className={`scene-btn ${currentScene === 'thank-you' ? 'active' : ''}`}
                        >
                            Thank You
                        </button>
                    </div>
                </section>

                {/* Draw Control Section */}
                <section className="control-section draw-section">
                    <h2>🎯 Draw Control</h2>

                    <div className="draw-status">
                        <div className="status-item">
                            <span className="status-label">Total:</span>
                            <span className="status-value">{settings.numberOfPrizes}</span>
                        </div>
                        <div className="status-item">
                            <span className="status-label">Drawn:</span>
                            <span className="status-value drawn">{winners.length}</span>
                        </div>
                        <div className="status-item">
                            <span className="status-label">Remaining:</span>
                            <span className="status-value remaining">{settings.numberOfPrizes - winners.length}</span>
                        </div>
                    </div>

                    <button
                        className="start-draw-btn"
                        onClick={handleStartDraw}
                        disabled={winners.length >= settings.numberOfPrizes}
                    >
                        {winners.length >= settings.numberOfPrizes
                            ? '✓ All Prizes Drawn'
                            : `🎲 Draw Prize #${settings.prizeOrder === 'descending'
                                ? settings.numberOfPrizes - winners.length
                                : winners.length + 1}`
                        }
                    </button>
                </section>

                {/* Winners List Section */}
                <section className="control-section winners-section">
                    <h2>🏆 Winners ({winners.length})</h2>

                    {winners.length === 0 ? (
                        <p className="no-winners">No winners drawn yet</p>
                    ) : (
                        <div className="winners-table">
                            <div className="winners-header">
                                <span>Prize</span>
                                <span>Ticket #</span>
                                <span>Time</span>
                            </div>
                            {winners.map((winner, idx) => (
                                <div key={idx} className="winner-row">
                                    <span className="prize-num">Prize #{winner.prizeNumber}</span>
                                    <span className="ticket-num">{winner.ticketNumber}</span>
                                    <span className="time">
                                        {new Date(winner.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Reset Controls */}
                <section className="control-section danger-section">
                    <h2>🔄 Reset</h2>
                    <button onClick={handleReset} className="reset-btn">
                        Reset All & Clear Winners
                    </button>
                </section>
            </main>
        </div>
    );
};

export default ControlView;

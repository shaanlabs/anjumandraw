import { useState, useEffect } from 'react';
import { useDrawContext } from '../context/DrawContext';
import { Play, RotateCcw } from 'lucide-react';

const ControlPanel = () => {
    const { settings, updateSettings, resetAll, drawStatus } = useDrawContext();

    const [numberOfPrizes, setNumberOfPrizes] = useState(settings.numberOfPrizes);
    const [ticketStart, setTicketStart] = useState(settings.ticketStart);
    const [ticketEnd, setTicketEnd] = useState(settings.ticketEnd);

    // Sync local state with context settings
    useEffect(() => {
        setNumberOfPrizes(settings.numberOfPrizes);
        setTicketStart(settings.ticketStart);
        setTicketEnd(settings.ticketEnd);
    }, [settings.numberOfPrizes, settings.ticketStart, settings.ticketEnd]);

    const handleApply = () => {
        updateSettings({
            numberOfPrizes,
            ticketStart,
            ticketEnd,
            countdownSeconds: 5,
            enableCountdown: true,
            allowDuplicates: false,
            minGap: 100
        });

        // Show success message
        alert('✅ Settings applied successfully!\n\nGo to Audience View to start the draw.');
    };

    const isDrawing = drawStatus === 'drawing' || drawStatus === 'countdown';

    return (
        <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl shadow-2xl border border-gold-500/30">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-gold-300 mb-2">⚙️ Quick Setup</h2>
                <p className="text-sm text-gray-400">Configure your lucky draw</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gold-200 mb-2">
                        Number of Prizes
                    </label>
                    <input
                        type="number"
                        value={numberOfPrizes}
                        onChange={(e) => setNumberOfPrizes(parseInt(e.target.value) || 1)}
                        min="1"
                        max="100"
                        className="w-full px-4 py-3 bg-navy-700 border border-gold-500/30 rounded-xl text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gold-200 mb-2">
                            Ticket Start
                        </label>
                        <input
                            type="number"
                            value={ticketStart}
                            onChange={(e) => setTicketStart(parseInt(e.target.value) || 1)}
                            min="1"
                            className="w-full px-4 py-3 bg-navy-700 border border-gold-500/30 rounded-xl text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gold-200 mb-2">
                            Ticket End
                        </label>
                        <input
                            type="number"
                            value={ticketEnd}
                            onChange={(e) => setTicketEnd(parseInt(e.target.value) || 100)}
                            min={ticketStart}
                            className="w-full px-4 py-3 bg-navy-700 border border-gold-500/30 rounded-xl text-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gold-500/20">
                    <button
                        onClick={handleApply}
                        disabled={isDrawing}
                        className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-black transition-all shadow-lg flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                    >
                        <Play className="w-5 h-5" />
                        Apply
                    </button>
                    <button
                        onClick={resetAll}
                        className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-black transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Reset
                    </button>
                </div>
            </div>

            <div className="mt-6 p-4 bg-navy-700/50 rounded-xl border border-gold-500/20">
                <p className="text-xs text-gray-400 text-center">
                    Auto-configured: 5s countdown, no duplicates, 100 ticket gap
                </p>
                <p className="text-xs text-orange-400 text-center mt-2">
                    💡 Go to Audience View to start the draw
                </p>
            </div>
        </div>
    );
};

export default ControlPanel;

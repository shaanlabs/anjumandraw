import { useNavigate } from 'react-router-dom';
import { useDrawContext } from '../context/DrawContext';
import ControlPanel from '../components/ControlPanel';
import { Eye } from 'lucide-react';

const AdminView = () => {
    const navigate = useNavigate();
    const { settings, winners } = useDrawContext();

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 p-8">
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-gold-400 mb-2">
                            Admin Control Panel
                        </h1>
                        <p className="text-gray-400">
                            Configure and manage the lucky draw
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-navy-700 hover:bg-navy-600 text-gold-300 rounded-lg font-semibold transition-colors flex items-center gap-2 border border-gold-500/30"
                    >
                        <Eye className="w-5 h-5" />
                        View Audience Screen
                    </button>
                </div>
            </div>

            {/* Control Panel */}
            <div className="max-w-4xl mx-auto">
                <ControlPanel />
            </div>

            {/* Quick Stats */}
            <div className="max-w-4xl mx-auto mt-8">
                <div className="bg-navy-800/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-gold-500/20">
                    <h3 className="text-xl font-display font-bold text-gold-300 mb-4">Quick Stats</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-navy-700/50 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-gold-400">{settings.numberOfPrizes}</div>
                            <div className="text-sm text-gray-400 mt-1">Total Prizes</div>
                        </div>
                        <div className="bg-navy-700/50 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-gold-400">{winners.length}</div>
                            <div className="text-sm text-gray-400 mt-1">Drawn</div>
                        </div>
                        <div className="bg-navy-700/50 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-gold-400">
                                {settings.numberOfPrizes - winners.length}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">Remaining</div>
                        </div>
                        <div className="bg-navy-700/50 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-gold-400">
                                {settings.ticketEnd - settings.ticketStart + 1}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">Total Tickets</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="max-w-4xl mx-auto mt-8">
                <div className="bg-blue-900/30 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-blue-500/20">
                    <h3 className="text-lg font-display font-bold text-blue-300 mb-3">
                        📋 Instructions
                    </h3>
                    <ul className="text-sm text-gray-300 space-y-2">
                        <li>• Configure all settings before starting the draw</li>
                        <li>• Click "View Audience Screen" to see what's projected</li>
                        <li>• The audience screen shows only the draw area and winners</li>
                        <li>• Use this admin panel to control the draw remotely</li>
                        <li>• Access this page anytime at: <code className="bg-navy-700 px-2 py-1 rounded">/admin</code></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminView;

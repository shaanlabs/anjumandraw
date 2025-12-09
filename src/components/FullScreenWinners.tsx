import React from 'react';
import { useDrawContext } from '../context/DrawContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';

const FullScreenWinners: React.FC = () => {
    const { winners, showFullScreen, toggleFullScreen } = useDrawContext();

    return (
        <AnimatePresence>
            {showFullScreen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-navy-900/98 backdrop-blur-lg overflow-y-auto"
                >
                    {/* Close Button */}
                    <button
                        onClick={toggleFullScreen}
                        className="fixed top-6 right-6 z-10 p-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Content */}
                    <div className="min-h-screen py-12 px-8">
                        {/* Header */}
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center mb-12"
                        >
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg box-glow">
                                    <span className="text-2xl font-bold text-navy-900">A</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-display font-bold text-white text-glow">
                                    All Lucky Draw Winners
                                </h1>
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center shadow-lg box-glow">
                                    <span className="text-2xl font-bold text-navy-900">🎉</span>
                                </div>
                            </div>
                            <p className="text-2xl text-gold-300 font-display">
                                Anjuman Day Celebration
                            </p>
                            <p className="text-xl text-gold-200 mt-2">
                                ANJUMAN HAMI MUSLIMEEN BHATKAL (AHMS Bhatkal)
                            </p>
                        </motion.div>

                        {/* Winners Grid */}
                        {winners.length === 0 ? (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center py-20"
                            >
                                <Trophy className="w-32 h-32 mx-auto text-gold-400/30 mb-6" />
                                <p className="text-3xl text-gray-400">No winners yet</p>
                            </motion.div>
                        ) : (
                            <div className="max-w-7xl mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {[...winners].sort((a, b) => a.prizeNumber - b.prizeNumber).map((winner, index) => (
                                        <motion.div
                                            key={`${winner.prizeNumber}-${winner.ticketNumber}`}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.3 + index * 0.05 }}
                                            className="bg-gradient-to-br from-navy-800 to-navy-700 rounded-2xl p-6 border-2 border-gold-500/30 hover:border-gold-400 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                                        >
                                            {/* Prize Badge */}
                                            <div className="flex justify-center mb-4">
                                                <div className="relative">
                                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
                                                        <Trophy className="w-10 h-10 text-navy-900" />
                                                    </div>
                                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                        {winner.prizeNumber}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Prize Number */}
                                            <div className="text-center mb-3">
                                                <p className="text-sm text-gray-400 mb-1">Prize #{winner.prizeNumber}</p>
                                                <div className="text-5xl font-display font-black text-gold-400 text-glow digital-number">
                                                    {winner.ticketNumber}
                                                </div>
                                            </div>

                                            {/* Timestamp */}
                                            <div className="text-center pt-3 border-t border-gold-500/20">
                                                <p className="text-xs text-gray-400">
                                                    🕐 {winner.timestamp.toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Summary */}
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 + winners.length * 0.05 }}
                                    className="mt-12 text-center"
                                >
                                    <div className="inline-block px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 rounded-2xl shadow-2xl">
                                        <p className="text-2xl font-display font-bold text-navy-900">
                                            Total Winners: {winners.length}
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FullScreenWinners;

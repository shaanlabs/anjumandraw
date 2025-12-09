import { motion } from 'framer-motion';
import { useDrawContext } from '../context/DrawContext';
import { Maximize2 } from 'lucide-react';

const WinnersList = () => {
    const { winners, toggleFullScreen } = useDrawContext();

    // Reverse the winners array so 1st prize (#1) appears at top
    const reversedWinners = [...winners].reverse();

    return (
        <div className="h-full flex flex-col bg-navy-800/40 backdrop-blur-2xl rounded-3xl border border-gold-500/30 shadow-2xl overflow-hidden"
            style={{
                boxShadow: '0 0 30px rgba(251, 191, 36, 0.2)'
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 p-4 md:p-6 border-b border-gold-500/20 bg-gradient-to-r from-navy-800/60 to-navy-700/60">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
                        <span className="text-xl md:text-2xl">🏆</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-gold-300">Winners</h2>
                </div>
                <div className="px-3 py-1 bg-gold-500/20 rounded-full text-sm md:text-base text-gold-300 font-bold">
                    {winners.length}
                </div>
            </div>

            {/* Winners List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-4">
                {winners.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-navy-700/50 flex items-center justify-center mb-4">
                            <span className="text-4xl md:text-5xl opacity-30">🏆</span>
                        </div>
                        <p className="text-base md:text-lg text-gray-400">No winners yet</p>
                        <p className="text-xs md:text-sm text-gray-500 mt-2">Winners will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-2 md:space-y-3">
                        {reversedWinners.map((winner, index) => {
                            // Since we reversed, the first item is the latest winner
                            const isLatest = index === 0;
                            const isFirstPrize = winner.prizeNumber === 1;

                            return (
                                <motion.div
                                    key={`${winner.ticketNumber}-${winner.prizeNumber}`}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`
                    p-3 md:p-4 rounded-2xl border transition-all duration-300
                    ${isLatest
                                            ? 'bg-gradient-to-r from-gold-500/20 to-orange-500/20 border-gold-400 shadow-lg'
                                            : 'bg-navy-700/30 border-navy-600/50 hover:border-gold-500/30'
                                        }
                    ${isFirstPrize ? 'ring-2 ring-gold-500/50' : ''}
                  `}
                                    style={{
                                        boxShadow: isLatest ? '0 0 20px rgba(251, 191, 36, 0.4)' : undefined
                                    }}
                                >
                                    <div className="flex items-center gap-3 md:gap-4">
                                        {/* Prize Badge */}
                                        <div className={`
                      w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-black text-navy-900 text-base md:text-lg shadow-lg flex-shrink-0
                      ${isFirstPrize
                                                ? 'bg-gradient-to-br from-yellow-300 via-gold-400 to-orange-500 animate-glow-pulse'
                                                : 'bg-gradient-to-br from-gold-400 to-orange-500'
                                            }
                    `}>
                                            #{winner.prizeNumber}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            {/* Prize Label */}
                                            {isFirstPrize && (
                                                <div className="text-xs font-bold text-gold-300 mb-1">
                                                    🏆 GRAND PRIZE
                                                </div>
                                            )}

                                            {/* Ticket Number */}
                                            <div className={`
                        font-black text-gold-300
                        ${isFirstPrize ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl lg:text-3xl'}
                      `}>
                                                {winner.ticketNumber}
                                            </div>

                                            {/* Time */}
                                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                                <span>🕐</span>
                                                <span>{winner.timestamp.toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}</span>
                                            </div>
                                        </div>

                                        {/* Latest Badge */}
                                        {isLatest && (
                                            <div className="px-2 md:px-3 py-1 bg-gold-500 text-navy-900 text-xs font-black rounded-full animate-pulse flex-shrink-0">
                                                LATEST
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* View Full Screen Button */}
            {winners.length > 0 && (
                <div className="p-3 md:p-4 border-t border-gold-500/20 bg-gradient-to-r from-navy-800/60 to-navy-700/60">
                    <button
                        onClick={toggleFullScreen}
                        className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                        <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
                        View Full Screen
                    </button>
                </div>
            )}
        </div>
    );
};

export default WinnersList;

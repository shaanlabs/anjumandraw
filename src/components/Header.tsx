import { motion } from 'framer-motion';

const Header = () => {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 py-3 md:py-4 px-4 md:px-6"
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between gap-3 md:gap-6">
                    {/* Left Logo - Premium Gold Border */}
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, 3, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="flex-shrink-0"
                    >
                        <div className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 rounded-full overflow-hidden shadow-2xl hover:scale-110 transition-all duration-500 bg-[#FFF8E7] border-4 border-[#D4AF37]"
                            style={{
                                boxShadow: '0 0 30px rgba(212, 175, 55, 0.6), 0 0 60px rgba(212, 175, 55, 0.3)'
                            }}
                        >
                            <img
                                src="/logo1.png"
                                alt="Anjuman Bhatkal Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* Center Title - Premium Gold Text */}
                    <div className="flex-1 text-center min-w-0 px-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="space-y-1"
                        >
                            {/* Main Title - Luxury Gold */}
                            <motion.h1
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-wider whitespace-nowrap"
                                animate={{
                                    textShadow: [
                                        '0 0 20px rgba(212, 175, 55, 0.5)',
                                        '0 0 40px rgba(212, 175, 55, 0.8)',
                                        '0 0 20px rgba(212, 175, 55, 0.5)'
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{
                                    background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4C1 25%, #D4AF37 50%, #F4E4C1 75%, #D4AF37 100%)',
                                    backgroundSize: '200% 200%',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    animation: 'gradient 3s ease infinite'
                                }}
                            >
                                ANJUMAN BHATKAL
                            </motion.h1>

                            {/* Event Subtitle - Teal Accent */}
                            <motion.div
                                className="flex items-center justify-center gap-1 md:gap-2"
                                animate={{ opacity: [0.8, 1, 0.8] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <span className="text-base md:text-xl animate-bounce hidden sm:inline">✨</span>
                                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold whitespace-nowrap text-[#14B8A6]">
                                    Digital Lucky Draw
                                </p>
                                <span className="text-base md:text-xl animate-bounce hidden sm:inline" style={{ animationDelay: '0.5s' }}>🎉</span>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right Logo - Premium Gold Border */}
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, -3, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        className="flex-shrink-0"
                    >
                        <div className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 rounded-full overflow-hidden shadow-2xl hover:scale-110 transition-all duration-500 bg-[#FFF8E7] border-4 border-[#D4AF37]"
                            style={{
                                boxShadow: '0 0 30px rgba(212, 175, 55, 0.6), 0 0 60px rgba(212, 175, 55, 0.3)'
                            }}
                        >
                            <img
                                src="/logo2.png"
                                alt="Anjuman Bhatkal Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Add gradient animation keyframes */}
            <style>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </motion.header>
    );
};

export default Header;

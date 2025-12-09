import { useDrawContext } from '../context/DrawContext';

const MessageTicker = () => {
    const { settings } = useDrawContext();

    if (!settings.customMessage) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-navy-900/95 backdrop-blur-md border-t border-gold-500/30 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap py-3">
                <span className="text-gold-300 text-lg md:text-xl font-semibold inline-block px-4">
                    ✨ {settings.customMessage} ✨
                </span>
                <span className="text-gold-300 text-lg md:text-xl font-semibold inline-block px-4">
                    ✨ {settings.customMessage} ✨
                </span>
                <span className="text-gold-300 text-lg md:text-xl font-semibold inline-block px-4">
                    ✨ {settings.customMessage} ✨
                </span>
            </div>

            <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
};

export default MessageTicker;

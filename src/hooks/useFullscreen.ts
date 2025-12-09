import { useState, useEffect, useCallback } from 'react';

export const useFullscreen = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Check if currently in fullscreen
    const checkFullscreen = useCallback(() => {
        const fullscreenElement =
            document.fullscreenElement ||
            (document as any).webkitFullscreenElement ||
            (document as any).mozFullScreenElement ||
            (document as any).msFullscreenElement;

        setIsFullscreen(!!fullscreenElement);
    }, []);

    // Enter fullscreen
    const enterFullscreen = useCallback(async () => {
        const elem = document.documentElement;

        try {
            if (elem.requestFullscreen) {
                await elem.requestFullscreen();
            } else if ((elem as any).webkitRequestFullscreen) {
                await (elem as any).webkitRequestFullscreen();
            } else if ((elem as any).mozRequestFullScreen) {
                await (elem as any).mozRequestFullScreen();
            } else if ((elem as any).msRequestFullscreen) {
                await (elem as any).msRequestFullscreen();
            }
        } catch (error) {
            console.error('Error entering fullscreen:', error);
        }
    }, []);

    // Exit fullscreen
    const exitFullscreen = useCallback(async () => {
        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) {
                await (document as any).webkitExitFullscreen();
            } else if ((document as any).mozCancelFullScreen) {
                await (document as any).mozCancelFullScreen();
            } else if ((document as any).msExitFullscreen) {
                await (document as any).msExitFullscreen();
            }
        } catch (error) {
            console.error('Error exiting fullscreen:', error);
        }
    }, []);

    // Toggle fullscreen
    const toggleFullscreen = useCallback(() => {
        if (isFullscreen) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    }, [isFullscreen, enterFullscreen, exitFullscreen]);

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            checkFullscreen();
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        // Initial check
        checkFullscreen();

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
    }, [checkFullscreen]);

    // Keyboard shortcut (F key)
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'f' || e.key === 'F') {
                // Don't trigger if user is typing in an input
                if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                    return;
                }
                e.preventDefault();
                toggleFullscreen();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [toggleFullscreen]);

    return {
        isFullscreen,
        enterFullscreen,
        exitFullscreen,
        toggleFullscreen,
    };
};

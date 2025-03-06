"use client"
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DesktopWindow from "./DesktopWindow";
import DesktopLauncher, { AppDefinition } from "./DesktopLauncher";
import { Code, FileText, Terminal, Settings } from "lucide-react";
import DesktopStatus from "./DesktopStatus";
import ChatInteraction from "@/components/apps/chat/Chat";
import { AppList } from "@/components/apps/AppList";
// Define the window interface with additional properties for focus and animations
interface WindowInstance {
    id: string;
    appId: string;
    title: string;
    content: React.ReactNode;
    zIndex: number;
    isMaximized: boolean;
    isFocused: boolean;
    initialX: number;
    initialY: number;
    width: number;
    height: number;
    isPreloadApp: boolean;
}

interface DesktopProps {
    preloadApp?: string; // Optional prop to preload an app on component mount
}

export default function Desktop({ preloadApp }: DesktopProps) {
    const [screenDimensions, setScreenDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
        height: typeof window !== 'undefined' ? window.innerHeight : 800,
    });

    // Define available apps
    const availableApps = AppList;

    // Launched windows state
    const [windows, setWindows] = useState<WindowInstance[]>([]);

    // Keep track of highest z-index to ensure newly focused windows are on top
    const [highestZIndex, setHighestZIndex] = useState(1);

    // Add startup animation state
    const [startupPhase, setStartupPhase] = useState<'initial' | 'background' | 'launcher' | 'complete'>('initial');

    // Calculate launched app IDs from windows
    const launchedAppIds = windows.map(window => window.appId);

    useEffect(() => {
        // Function to update screen dimensions
        const updateDimensions = () => {
            setScreenDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        // Set dimensions on initial load
        updateDimensions();

        // Add event listener for window resize
        window.addEventListener('resize', updateDimensions);

        // Clean up event listener on component unmount
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Startup animation sequence
    useEffect(() => {
        // Start the animation sequence
        const animationSequence = async () => {
            // First phase - background appears
            setStartupPhase('background');

            // Second phase - launcher appears
            setTimeout(() => {
                setStartupPhase('launcher');
            }, 600);

            // Final phase - everything is loaded
            setTimeout(() => {
                setStartupPhase('complete');
            }, 1200);
        };

        animationSequence();
    }, []);

    // Handle launching an app
    const handleLaunchApp = (appId: string, centerPosition: boolean = false, isPreload: boolean = false) => {
        // Check if app is already launched
        if (launchedAppIds.includes(appId)) {
            // Focus the existing window
            focusWindow(windows.find(window => window.appId === appId)?.id || "");
            return;
        }

        const appToLaunch = availableApps.find(app => app.id === appId);
        if (!appToLaunch) return;

        const newWindowId = `window-${appId}-${Date.now()}`;
        const newZIndex = highestZIndex + 1;

        // Use app-specific width/height if provided, otherwise default values
        const windowWidth = appToLaunch.width || 400;
        const windowHeight = appToLaunch.height || 300;

        // Position based on whether we want to center the window
        let initialX, initialY;

        if (centerPosition) {
            // Center the window in the screen
            initialX = (screenDimensions.width - windowWidth) / 2;
            initialY = (screenDimensions.height - windowHeight) / 2;
        } else {
            // Generate random position within the visible screen area
            // Ensure windows don't spawn too close to edges
            const padding = 50;
            const maxX = screenDimensions.width - windowWidth - padding;
            const maxY = screenDimensions.height - windowHeight - padding;

            initialX = Math.floor(Math.random() * (maxX - padding)) + padding;
            initialY = Math.floor(Math.random() * (maxY - padding)) + padding;
        }

        // Create new window
        const newWindow: WindowInstance = {
            id: newWindowId,
            appId: appToLaunch.id,
            title: appToLaunch.title,
            content: appToLaunch.component,
            zIndex: newZIndex,
            isMaximized: false,
            isFocused: true,
            initialX,
            initialY,
            width: windowWidth,
            height: windowHeight,
            isPreloadApp: isPreload
        };

        // Update windows state - unfocus all other windows and add new one
        setWindows(prevWindows =>
            [...prevWindows.map(window => ({
                ...window,
                isFocused: false
            })), newWindow]
        );

        // Update highest z-index
        setHighestZIndex(newZIndex);
    };

    // Handle closing a window
    const handleCloseWindow = (windowId: string) => {
        setWindows(prevWindows => prevWindows.filter(window => window.id !== windowId));
    };

    // Handle maximizing a window
    const handleMaximizeWindow = (windowId: string) => {
        setWindows(prevWindows =>
            prevWindows.map(window =>
                window.id === windowId
                    ? { ...window, isMaximized: !window.isMaximized }
                    : window
            )
        );
    };

    // Handle focusing a window
    const focusWindow = (windowId: string) => {
        if (!windowId) return;

        const newZIndex = highestZIndex + 1;

        setWindows(prevWindows =>
            prevWindows.map(window => ({
                ...window,
                zIndex: window.id === windowId ? newZIndex : window.zIndex,
                isFocused: window.id === windowId
            }))
        );

        setHighestZIndex(newZIndex);
    };

    // Add useEffect to preload app on mount if specified
    useEffect(() => {
        if (preloadApp && startupPhase === 'complete') {
            handleLaunchApp(preloadApp, true, true);
        }
    }, [preloadApp, startupPhase]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="fixed inset-0 overflow-hidden">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 1 }}
                className="absolute right-5 text-sm rounded-sm top-10 bg-black/10 backdrop-blur-lg text-white/80 p-2"

            >
                <strong>drag top</strong> to maximize window
                <br />
                <strong>drag bottom</strong> to close window
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{
                    opacity: startupPhase === 'complete' || startupPhase === 'launcher' ? 1 : 0,
                    y: startupPhase === 'complete' || startupPhase === 'launcher' ? 0 : 10
                }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            >
                <DesktopStatus currentWindow={windows.find(window => window.isFocused)?.title || "Home"} />
            </motion.div>

            <AnimatePresence>
                {windows.map((window) => (
                    <motion.div
                        key={window.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0, y: 100 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ zIndex: window.zIndex }}
                    >
                        <DesktopWindow
                            width={window.width}
                            height={window.height}
                            screenWidth={screenDimensions.width}
                            screenHeight={screenDimensions.height}
                            onClose={() => handleCloseWindow(window.id)}
                            onMaximize={() => handleMaximizeWindow(window.id)}
                            onFocus={() => focusWindow(window.id)}
                            initialX={window.initialX}
                            initialY={window.initialY}
                            isPreloadApp={window.isPreloadApp}
                            style={{
                                backgroundColor: window.isFocused
                                    ? "rgba(0, 0, 0, 0.7)" // 10% darker when focused
                                    : "rgba(0, 0, 0, 0.6)",
                                zIndex: window.zIndex
                            }}
                        >
                            {window.content}
                        </DesktopWindow>
                    </motion.div>
                ))}
            </AnimatePresence>

            <DesktopLauncher
                apps={availableApps}
                launchedApps={launchedAppIds}
                onLaunchApp={handleLaunchApp}
                startupPhase={startupPhase}
            />
        </div>
    );
}
"use client"
import { useEffect, useCallback, useMemo, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DesktopWindow from "./DesktopWindow";
import DesktopLauncher from "./DesktopLauncher";
import DesktopStatus from "./DesktopStatus";
import { AppList } from "@/components/apps/AppList";
import { useRouter } from "next/navigation";
import type { AppContext } from "@/components/apps/AppList";
import { DesktopProps } from "./types";
import { useScreenDimensions, useStartupAnimation, useMobileRedirect } from "./hooks";
import { useWindowManager } from "./window-manager";

// Loading fallback for desktop window content
const WindowLoadingFallback = () => (
    <div className="flex items-center justify-center h-full w-full bg-black/30 text-white/50">
        <div className="animate-pulse">Loading...</div>
    </div>
);

export default function Desktop({ preloadApp, initialContext }: DesktopProps) {
    const router = useRouter();
    
    // Use our custom hooks
    const screenDimensions = useScreenDimensions();
    const startupPhase = useStartupAnimation();
    
    // Use window manager for window state
    const {
        windows,
        getLaunchedAppIds,
        getFocusedWindow,
        launchApp,
        closeWindow,
        toggleMaximize,
        focusWindow,
        closeAllWindows
    } = useWindowManager(screenDimensions);

    // Calculate launched app IDs - memoized to prevent unnecessary calculations
    const launchedAppIds = useMemo(() => getLaunchedAppIds(), [getLaunchedAppIds]);
    
    // Get current focused window title for status bar - memoized
    const currentWindowTitle = useMemo(() => {
        const focusedWindow = getFocusedWindow();
        return focusedWindow?.title || 'Desktop';
    }, [getFocusedWindow]);

    // Get redirect path for mobile
    const getRedirectPath = useCallback(() => {
        const focusedWindow = getFocusedWindow();
        return `/${focusedWindow?.appId || "chat"}`;
    }, [getFocusedWindow]);

    // Handle mobile redirect
    const handleMobileRedirect = useCallback(() => {
        const redirectPath = getRedirectPath();
        router.prefetch(redirectPath);
        closeAllWindows();
        router.push(redirectPath);
    }, [router, getRedirectPath, closeAllWindows]);

    // Use our mobile redirect hook
    useMobileRedirect(screenDimensions, getRedirectPath, handleMobileRedirect);

    // Update the preload app useEffect
    useEffect(() => {
        if (preloadApp && startupPhase === 'complete') {
            // Create props factory to handle inter-app communication
            const createAppProps = (windowId: string) => ({
                context: initialContext,
                onLaunchApp: (childAppId: string, childCenterPosition?: boolean, childContext?: AppContext) => {
                    // Allow apps to launch other apps and pass context
                    launchApp(
                        childAppId, 
                        childCenterPosition || false, 
                        childContext ? {
                            ...childContext,
                            source: preloadApp // Add source info
                        } : undefined
                    );
                },
                onClose: () => closeWindow(windowId)
            });
            
            // Launch the preload app with initial focus, but allow it to be unfocused later
            launchApp(preloadApp, true, initialContext, true, createAppProps);
            
            // The window manager already sets the initial focus correctly,
            // and our focusWindow logic allows changing focus to other windows
        }
    }, [startupPhase]); //NEVER CHANGE THIS
    
    // Create a handler for app launching from launcher
    const handleLaunchApp = useCallback((
        appId: string,
        centerPosition: boolean = false,
        context?: AppContext,
        isPreload: boolean = false
    ) => {
        // Create props factory to handle inter-app communication
        const createAppProps = (windowId: string) => ({
            context,
            onLaunchApp: (childAppId: string, childCenterPosition?: boolean, childContext?: AppContext) => {
                // Allow apps to launch other apps and pass context
                launchApp(
                    childAppId, 
                    childCenterPosition || false, 
                    childContext ? {
                        ...childContext,
                        source: appId // Add source info
                    } : undefined
                );
            },
            onClose: () => closeWindow(windowId)
        });
        
        launchApp(appId, centerPosition, context, isPreload, createAppProps);
        
    }, [launchApp, closeWindow]);

    return (
        <div className="fixed inset-0 overflow-hidden">
            {/* Desktop background */}
            {/* Helpful text overlay */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: startupPhase === 'complete' || startupPhase === 'launcher' ? 1 : 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute right-5 text-sm rounded-sm top-10 bg-black/10 backdrop-blur-lg text-white/80 p-2"
            >
                Drag the window to the top edge to maximize it, or to the bottom edge to close it.
            </motion.div>

            {/* Desktop status bar (top) */}
            <DesktopStatus currentWindow={currentWindowTitle} />

            {/* Desktop window instances */}
            <AnimatePresence>
                {windows.map(window => (
                    <motion.div
                        key={window.id}
                        initial={
                            { scale: 0.8, opacity: 0 }
                        }
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 100 }}
                        transition={{ 
                            duration:  0.3, 
                            ease: "easeOut" 
                        }}
                        style={{ zIndex: window.zIndex }}
                    >
                        <DesktopWindow
                            width={window.width}
                            height={window.height}
                            initialX={window.initialX}
                            initialY={window.initialY}
                            screenWidth={screenDimensions.width}
                            screenHeight={screenDimensions.height}
                            onClose={() => closeWindow(window.id)}
                            onMaximize={() => toggleMaximize(window.id)}
                            onFocus={() => focusWindow(window.id)}
                            style={{ 
                                zIndex: window.zIndex,
                                boxShadow: window.isFocused ? '0 0 20px rgba(0, 0, 0, 0.5)' : 'none',
                                backgroundColor: window.isFocused
                                    ? "rgba(0, 0, 0, 0.7)" // 10% darker when focused
                                    : "rgba(0, 0, 0, 0.6)"
                            }}
                        >
                            <Suspense fallback={<WindowLoadingFallback />}>
                                {window.content}
                            </Suspense>
                        </DesktopWindow>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* App launcher bar */}
            <DesktopLauncher 
                apps={AppList} 
                launchedApps={launchedAppIds}
                onLaunchApp={handleLaunchApp}
                startupPhase={startupPhase}
            />
        </div>
    );
}
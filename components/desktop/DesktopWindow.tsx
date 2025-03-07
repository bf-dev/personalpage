// props: children, width, height, screenWidth, screenHeight
// onClose, onFullscreen
//windowstate: width, height, zIndex, focused, fullscreen
//windowproperties: isResizable, width, height, minWidth, minHeight, maxWidth, maxHeight(?), icon, title

import { AnimatePresence, useDragControls, useMotionValue, useTransform } from "framer-motion";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback, memo } from "react";
import { DesktopWindowProps } from "./types";

const DesktopWindow = ({ 
  children, 
  width: initialWidth = 400, 
  height: initialHeight = 300, 
  screenWidth, 
  screenHeight, 
  onClose,
  onMaximize,
  onFocus,
  initialX = 0,
  initialY = 0,
  style = {},
}: DesktopWindowProps) => {
    const dragControls = useDragControls();
    const x = useMotionValue(initialX);
    const y = useMotionValue(initialY);
    const windowWidth = useMotionValue(initialWidth);
    const windowHeight = useMotionValue(initialHeight);
    
    const [preClose, setPreClose] = useState(false);
    const [preMaximize, setPreMaximize] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    
    // Handle window focus when clicked - memoized to prevent unnecessary re-renders
    const handleWindowClick = useCallback(() => {
        if (onFocus) onFocus();
    }, [onFocus]);

    // Update window dimensions when maximized state changes
    useEffect(() => {
        if (isMaximized) {
            windowWidth.set(screenWidth);
            windowHeight.set(screenHeight);
            x.set(0);
            y.set(0);
        } else {
            windowWidth.set(initialWidth);
            windowHeight.set(initialHeight);
            // If window was maximized, center it on screen when restored
            if (x.get() === 0 && y.get() === 0) {
                x.set(initialX);
                y.set(initialY);
            }
        }
    }, [isMaximized, initialX, initialY, initialWidth, initialHeight, screenWidth, screenHeight, x, y, windowWidth, windowHeight]);

    // Monitor vertical position to show UI cues for actions
    useEffect(() => {
        const unsubscribe = y.on("change", (value) => {
            if (value < 0) {
                setPreMaximize(true);
            } else if (value > screenHeight - windowHeight.get()) {
                setPreClose(true);
            } else {
                setPreClose(false);
                setPreMaximize(false);
            }
        });
        
        return () => unsubscribe();
    }, [y, screenHeight, windowHeight]);

    // Handle drag end actions - maximize or close
    const determineMaximizeMinimize = useCallback(() => {
        if (preMaximize && y.get() < 0) {
            onMaximize();
            setIsMaximized(true);
        } else if (preClose && y.get() > screenHeight - windowHeight.get()) {
            if (isMaximized) {
                setIsMaximized(false);
            } else {
                onClose();
            }
        }
    }, [preMaximize, preClose, y, screenHeight, windowHeight, onMaximize, onClose, isMaximized]);

    const handleDragEnd = useCallback(() => {
        determineMaximizeMinimize();
    }, [determineMaximizeMinimize]);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        dragControls.start(e);
        if (onFocus) onFocus();
    }, [dragControls, onFocus]);

    return (
        <motion.div 
            className="absolute backdrop-blur-2xl rounded-lg overflow-hidden"
            drag={true}
            dragControls={dragControls}
            onDragEnd={handleDragEnd}
            dragMomentum={false}
            dragElastic={0.2}
            dragConstraints={{
                top: 0,
                left: 0,
                right: screenWidth - windowWidth.get(),
                bottom: screenHeight - windowHeight.get()
            }}
            onClick={handleWindowClick}
            style={{
                x,
                y,
                width: windowWidth,
                height: windowHeight,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                borderRadius: isMaximized ? "0px" : "10px",
                transition: "width 0.3s ease-in-out, height 0.3s ease-in-out, border-radius 0.2s ease-in-out",
                ...style
            }}
        >
            {/* Window header/handle bar */}
            <div 
                className="flex items-center p-2 cursor-grab"
                onPointerDown={handlePointerDown}
            >
                <div className="flex-1 flex items-center justify-center flex-col">
                    <div className={`h-1 transition-all mt-1 bg-white/20 rounded-full ${preClose ? "w-4" : preMaximize ? "w-16" : "w-8"} `} />
                    <AnimatePresence>
                        {preClose && (
                            <motion.p 
                                className="text-white/20 text-xs mt-0.5" 
                                initial={{y: -10, opacity: 0, height: 0}} 
                                animate={{y: 0, opacity: 1, height: "auto"}} 
                                exit={{y: -10, opacity: 0, height: 0}}
                            >
                                {isMaximized ? "Release to exit full screen" : "Release to close"}
                            </motion.p>
                        )}
                        {preMaximize && (
                            <motion.p 
                                className="text-white/20 text-xs mt-0.5" 
                                initial={{y: -10, opacity: 0, height: 0}} 
                                animate={{y: 0, opacity: 1, height: "auto"}} 
                                exit={{y: -10, opacity: 0, height: 0}}
                            >
                                Release to maximize
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            
            {/* Window content */}
            <div className="h-full overflow-auto" onClick={handleWindowClick}>
                {children}
            </div>
        </motion.div>
    );
};

export default memo(DesktopWindow);
// props: children, width, height, screenWidth, screenHeight
// onClose, onFullscreen
//windowstate: width, height, zIndex, focused, fullscreen
//windowproperties: isResizable, width, height, minWidth, minHeight, maxWidth, maxHeight(?), icon, title

import { AnimatePresence, useDragControls, useMotionValue, useTransform } from "framer-motion";
import { motion } from "framer-motion";
import { useState, ReactNode, useEffect, CSSProperties } from "react";

interface DesktopWindowProps {
  children?: ReactNode;
  width?: number;
  height?: number;
  screenWidth: number;
  screenHeight: number;
  onClose: () => void;
  onMaximize: () => void;
  onFocus?: () => void;
  initialX?: number;
  initialY?: number;
  style?: CSSProperties;
  isPreloadApp?: boolean;
}

export default function DesktopWindow({ 
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
  isPreloadApp = false
}: DesktopWindowProps) {
    const dragControls = useDragControls();
    const x = useMotionValue(initialX);
    const y = useMotionValue(initialY);
    const windowWidth = useMotionValue(initialWidth);
    const windowHeight = useMotionValue(initialHeight);
    
    const [preClose, setPreClose] = useState(false);
    const [preMaximize, setPreMaximize] = useState(false);
    
    const [isMaximized, setIsMaximized] = useState(false);

    const [preloadAppAnimation, setPreloadAppAnimation] = useState(false);
    // Handle window focus when clicked
    const handleWindowClick = () => {
        if (onFocus) onFocus();
    };

    useEffect(() => {
        if (isMaximized) {
            windowWidth.set(screenWidth);
            windowHeight.set(screenHeight);
            x.set(0);
            y.set(0);
        }else{
            windowWidth.set(initialWidth);
            windowHeight.set(initialHeight);
            // If window was maximized, center it on screen when restored
            if (x.get() === 0 && y.get() === 0) {
                x.set(initialX);
                y.set(initialY);
            }
        }
    }, [isMaximized, initialX, initialY, initialWidth, initialHeight, screenWidth, screenHeight]);

    y.on("change", (value) => {
        if (value < 0) {
            setPreMaximize(true);
        } else if (value > screenHeight - windowHeight.get()) {
            setPreClose(true);
        }else{
            setPreClose(false);
            setPreMaximize(false);
        }
    })
    const handleDragEnd = () => {
        console.log("dragEnd")
        determineMaximizeMinimize();
    }
    const determineMaximizeMinimize = () => {

        if (preMaximize && y.get() < 0) {
            onMaximize();
            setIsMaximized(true);
        } else if (preClose && y.get() > screenHeight - windowHeight.get()) {
            if (isMaximized) {
                setIsMaximized(false);
            }else{
                onClose();
            }
        }
    }
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
                borderRadius: isMaximized ? "0px" : preloadAppAnimation ? "0px" : "10px",
                transition: "width 0.3s ease-in-out, height 0.3s ease-in-out, border-radius 0.2s ease-in-out",
                ...style
            }}
        >
            {/* Window header/handle bar */}
            <div 
                className="flex items-center p-2 cursor-grab"
                onPointerDown={(e) => {
                    dragControls.start(e);
                    if (onFocus) onFocus();
                }}
            >
                <div className="flex-1 flex items-center justify-center flex-col">
                    <div className={`h-1 transition-all mt-1 bg-white/20 rounded-full ${preClose ? "w-4" : preMaximize ? "w-16" : "w-8"} `} />
                    <AnimatePresence>
                        {preClose && (
                            <motion.p className="text-white/20 text-xs mt-0.5" initial={{y: -10, opacity: 0, height: 0}} animate={{y: 0, opacity: 1, height: "auto"}} exit={{y: -10, opacity: 0, height: 0}}>Release to close</motion.p>
                        )}
                        {preMaximize && (
                            <motion.p className="text-white/20 text-xs mt-0.5" initial={{y: -10, opacity: 0, height: 0}} animate={{y: 0, opacity: 1, height: "auto"}} exit={{y: -10, opacity: 0, height: 0}}>Release to maximize</motion.p>
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
}
import { memo, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DesktopLauncherProps } from './types';
import { AppDefinition } from '../apps/AppList';
import { Info, MessageSquare, Flag, Type, Cat } from 'lucide-react';

interface DesktopIconPosition {
  x: number;
  y: number;
  rotation: number;
}

interface DesktopIconsProps extends Omit<DesktopLauncherProps, 'startupPhase'> {
  // Additional props specific to scattered desktop icons
  screenWidth: number;
  screenHeight: number;
}

// Specific app IDs to display on desktop
const DESKTOP_APP_IDS = ['about', 'chat', 'flag', 'typewriter', 'kitten'];

// Map of app IDs to specific Lucide icons
const APP_ICON_MAP: Record<string, React.ElementType> = {
  'about': Info,
  'chat': MessageSquare,
  'flag': Flag,
  'typewriter': Type,
  'kitten': Cat
};

const DesktopIcons = ({ 
  apps = [], 
  launchedApps = [], 
  onLaunchApp,
  screenWidth,
  screenHeight
}: DesktopIconsProps) => {
  // Filter for only specific apps we want to show on desktop
  const visibleApps = apps?.filter(app => DESKTOP_APP_IDS.includes(app.id)) || [];
  
  console.log('DesktopIcons rendering with apps:', visibleApps.length);
  
  // Generate fixed positions for icons in a grid layout
  // Use useMemo to prevent regenerating positions on every render
  const iconPositions = useMemo(() => {
    const positions: Record<string, DesktopIconPosition> = {};
    
    // Safe margins to keep icons from edge of screen
    const safeMarginX = 0;
    const safeMarginY = 0;
    
    // Available space
    const availableWidth = Math.max(1, screenWidth - safeMarginX * 2);
    const availableHeight = Math.max(1, screenHeight - safeMarginY * 2);
    
    // Reserve top bar area
    const topBarHeight = 20;
    
    // Icon spacing and size
    const iconWidth = 120; // Width including padding and label
    const iconHeight = 140; // Height including padding and label
    
    // Calculate number of columns that can fit in the available width
    const columns = Math.floor(availableWidth / iconWidth);
    
    visibleApps.forEach((app, index) => {
      // Calculate grid position (left-to-right, top-to-bottom)
      const col = index % columns;
      const row = Math.floor(index / columns);
      
      // Fixed position calculation
      const x = safeMarginX + (col * iconWidth) + (iconWidth / 2);
      const y = safeMarginY + topBarHeight + (row * iconHeight) + (iconHeight / 2);
      
      // No rotation
      const rotation = 0;
      
      positions[app.id] = { x, y, rotation };
    });
    
    return positions;
  }, [visibleApps, screenWidth, screenHeight]);
  
  // Memoized app launcher callback
  const createAppLaunchHandler = useCallback((appId: string) => () => {
    if (onLaunchApp) onLaunchApp(appId);
  }, [onLaunchApp]);
  
  // If no screen dimensions provided, don't render
  if (!screenWidth || !screenHeight) {
    console.log('No screen dimensions provided to DesktopIcons');
    return null;
  }
  
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10">
      {visibleApps.map((app) => {
        const position = iconPositions[app.id];
        const isLaunched = launchedApps?.includes(app.id) || false;
        
        if (!position) {
          console.log('No position for app:', app.id);
          return null;
        }
        
        // Get the Lucide icon component for this app
        const IconComponent = APP_ICON_MAP[app.id] || Info;
        
        // Fixed position icons
        return (
          <motion.div 
            key={app.id}
            className="absolute pointer-events-auto"
            style={{ 
              left: position.x, 
              top: position.y,
              transform: 'translate(-50%, -50%)' // Center the icon on the grid point
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1
            }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.05 * visibleApps.indexOf(app) // Sequential appearance
            }}
            whileHover={{ 
              scale: 1.01,
              transition: { type: "spring", stiffness: 300, damping: 10 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div 
              className={`flex flex-col items-center justify-center cursor-pointer`}
              onClick={createAppLaunchHandler(app.id)}
            >
              {/* Lucide icon for the app */}
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl shadow-lg 
                ${isLaunched ? 'bg-black/20 ring-white/50' : 'bg-black/40 hover:bg-black/30'}`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              
              {/* App name */}
              <div className="mt-2 px-2 py-1 text-white text-xs bg-black/50 backdrop-blur-sm rounded text-center">
                {app.title}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default memo(DesktopIcons);
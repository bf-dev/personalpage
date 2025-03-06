import { useState } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

// Define available applications
export interface AppDefinition {
  id: string;
  title: string;
  icon: keyof typeof LucideIcons;
  component: React.ReactNode;
  width?: number;  // Optional width with default value applied in the Desktop component
  height?: number; // Optional height with default value applied in the Desktop component
}

interface DesktopLauncherProps {
  apps: AppDefinition[];
  launchedApps: string[];
  onLaunchApp: (appId: string) => void;
  startupPhase: 'initial' | 'background' | 'launcher' | 'complete';
}

export default function DesktopLauncher({ apps, launchedApps, onLaunchApp, startupPhase }: DesktopLauncherProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center items-center pb-4 pointer-events-none">
      <motion.div 
        className="px-6 py-3 bg-black/30 backdrop-blur-md rounded-xl pointer-events-auto"
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: startupPhase === 'complete' || startupPhase === 'launcher' ? 0 : 100,
          opacity: startupPhase === 'complete' || startupPhase === 'launcher' ? 1 : 0
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25,
          delay: 0.2
        }}
      >
        <div className="flex space-x-4">
          {apps.map((app) => {
            const Icon = LucideIcons[app.icon];
            const isLaunched = launchedApps.includes(app.id);
            
            return (
              <motion.button
                key={app.id}
                className={`relative p-3 rounded-lg transition-all ${
                  isLaunched ? 'bg-white/20' : 'bg-black/40 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onLaunchApp(app.id)}
                title={app.title}
              >
                {/* @ts-ignore - Dynamic icon component from Lucide */}
                <Icon className="w-6 h-6 text-white" />
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

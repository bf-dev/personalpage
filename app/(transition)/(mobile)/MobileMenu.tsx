'use client';

import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import { AppList } from '@/components/apps/AppList';
import * as LucideIcons from 'lucide-react';

export default function MobileMenu() {
    const router = useRouter();
    const pathname = usePathname();
    const [isFolderOpen, setIsFolderOpen] = useState(false);
    const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

    // Get the mobile-visible apps - those that are not hidden or are folder apps
    const visibleApps = AppList.filter(app => 
        !app.isHidden || 
        (app.id.includes('folder') || app.icon.includes('Folder'))
    );

    // Find the folder app if that's what we're viewing
    const currentAppId = pathname.split('/').pop();
    const isViewingFolderContent = 
        currentAppId && 
        AppList.find(app => 
            app.id === currentAppId && 
            (app.id.includes('folder') || app.icon.includes('Folder'))
        );

    return (
        <nav className="flex flex-col items-center space-y-2 fixed bottom-6 left-0 right-0 z-50 text-white">
            {/* Folder popup if a folder is open */}
            <AnimatePresence>
                {isFolderOpen && activeFolderId && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="bg-black/70 backdrop-blur-md rounded-lg p-3 mb-2 shadow-lg"
                    >
                        <div className="flex flex-wrap gap-3 justify-center max-w-xs">
                            {/* Find the folder's app IDs */}
                            {AppList.find(app => app.id === activeFolderId)?.capabilities?.canLaunchApps && 
                                AppList.map(app => {
                                    // Folder apps include IDs in their title or content for simplicity
                                    const isFolderContent = 
                                        activeFolderId === 'utilities' && ['calculator', 'flag'].includes(app.id) ||
                                        activeFolderId === 'media' && ['kitten', 'typewriter'].includes(app.id) ||
                                        activeFolderId === 'all-apps' && ['calculator', 'flag', 'kitten', 'thoughts', 'typewriter'].includes(app.id);
                                    
                                    if (!isFolderContent) return null;
                                    
                                    const Icon = LucideIcons[app.icon];
                                    return (
                                        <button
                                            key={app.id}
                                            className="flex flex-col items-center justify-center p-2 w-16"
                                            onClick={() => {
                                                setIsFolderOpen(false);
                                                router.push(`/${app.id}`);
                                            }}
                                        >
                                            <div className="bg-black/40 p-2 rounded-full mb-1">
                                                {/* @ts-ignore - Dynamic icon component from Lucide */}
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs">{app.title}</span>
                                        </button>
                                    );
                                })
                            }
                            <button
                                className="absolute top-1 right-1 p-1 rounded-full bg-black/40"
                                onClick={() => setIsFolderOpen(false)}
                            >
                                {/* @ts-ignore */}
                                <LucideIcons.X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Main app navigation bar */}
            <div className="flex items-center justify-center space-x-2 rounded-full bg-black/40 backdrop-blur-lg p-2 shadow-lg">
                {visibleApps.map((app) => {
                    const isActive = pathname === `/${app.id}`;
                    const isFolder = app.id.includes('folder') || app.icon.includes('Folder');
                    const Icon = LucideIcons[app.icon];
                    
                    return (
                        <button
                            key={app.id}
                            className={cn(
                                "relative flex items-center justify-center p-2 rounded-full transition-colors",
                                isActive 
                                    ? "bg-white/20 text-white" 
                                    : "text-gray-400 hover:text-white hover:bg-white/10"
                            )}
                            onClick={() => {
                                if (isFolder) {
                                    setActiveFolderId(app.id);
                                    setIsFolderOpen(true);
                                } else {
                                    router.push(`/${app.id}`);
                                }
                            }}
                        >
                            {/* @ts-ignore - Dynamic icon component from Lucide */}
                            <Icon className="w-5 h-5" />
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
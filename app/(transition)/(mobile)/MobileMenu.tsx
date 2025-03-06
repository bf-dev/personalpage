'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from "framer-motion";
import { AppList } from '@/components/apps/AppList';
import * as LucideIcons from 'lucide-react';

export default function MobileMenu() {
    const router = useRouter();
    const pathname = usePathname();


    return (
        <nav className="flex items-center justify-center space-x-4 rounded-full bg-black/10 backdrop-blur-lg p-2 mx-auto max-w-fit shadow-[inset_0_0_5px_#ffffff30] fixed bottom-6 left-0 right-0 z-50 text-white">
            <div className="relative flex">

                
                {/* App buttons */}
                {AppList.map((app, index) => {
                    const isActive = pathname.includes(`/${app.id}`);
                    const Icon = LucideIcons[app.icon];
                    
                    return (
                        <button
                            key={app.id}

                            className={cn(
                                "relative flex items-center justify-center p-2 rounded-full transition-colors",
                                isActive ? "text-white" : "text-gray-400 hover:text-white"
                            )}
                            onClick={() => router.push(`/${app.id}`)}

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
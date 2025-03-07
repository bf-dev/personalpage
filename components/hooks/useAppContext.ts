import { useState, useEffect } from 'react';
import { AppContext } from '../apps/AppList';

/**
 * Custom hook to manage app context in mobile mode
 * Allows for seamless context sharing between apps
 */
export function useAppContext(appId: string) {
    const [context, setContext] = useState<AppContext | undefined>(undefined);
    
    // Load context from localStorage on component mount
    useEffect(() => {
        try {
            const savedContext = localStorage.getItem(`app_context_${appId}`);
            if (savedContext) {
                setContext(JSON.parse(savedContext));
            }
        } catch (error) {
            console.error("Error loading app context:", error);
        }
    }, [appId]);

    // Method to update context and save to localStorage
    const updateContext = (newContext: AppContext) => {
        setContext(newContext);
        try {
            localStorage.setItem(`app_context_${appId}`, JSON.stringify(newContext));
        } catch (error) {
            console.error("Error saving app context:", error);
        }
    };

    // Method to create a launchApp function for mobile
    const createLaunchAppHandler = (router: any) => {
        return (targetAppId: string, centerPosition?: boolean, launchContext?: AppContext) => {
            // Save context to localStorage for cross-page persistence
            if (launchContext) {
                try {
                    localStorage.setItem(
                        `app_context_${targetAppId}`, 
                        JSON.stringify({
                            ...launchContext,
                            source: appId // Add source app ID
                        })
                    );
                } catch (error) {
                    console.error("Error saving context for app launch:", error);
                }
            }
            
            // Navigate to the app page
            router.push(`/${targetAppId}`);
        };
    };

    return {
        context,
        updateContext,
        createLaunchAppHandler
    };
} 
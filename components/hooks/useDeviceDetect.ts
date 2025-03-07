import { useState, useEffect } from 'react';

/**
 * Custom hook to detect whether app is running on mobile or desktop
 * This helps components adapt their UI accordingly
 */
export function useDeviceDetect() {
    const [isMobile, setIsMobile] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        // Function to check device width
        const checkDevice = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setIsDesktop(!mobile);
            setIsLoading(false);
        };
        
        // Check immediately
        checkDevice();
        
        // Set up listener for window resize
        window.addEventListener('resize', checkDevice);
        
        // Clean up listener
        return () => {
            window.removeEventListener('resize', checkDevice);
        };
    }, []);
    
    // Check if we're in the mobile route structure
    const [isMobileRoute, setIsMobileRoute] = useState(false);
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Check if the URL includes /desktop which indicates desktop mode
            const isDesktopRoute = window.location.pathname.includes('/desktop');
            setIsMobileRoute(!isDesktopRoute);
        }
    }, []);
    
    return {
        isMobile,
        isDesktop,
        isMobileRoute,
        isLoading
    };
} 
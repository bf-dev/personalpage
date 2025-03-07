"use client";
import Desktop from "@/components/desktop/Desktop";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AppContext } from "@/components/apps/AppList";

export default function DesktopPage() {
    return (
        <Suspense fallback={<div className="text-white">Loading...</div>}>
            <DesktopContent />
        </Suspense>
    )
}

function DesktopContent() {
    const searchParams = useSearchParams();
    const preloadApp = searchParams.get("preloadApp") || undefined;
    const [initialContext, setInitialContext] = useState<AppContext | undefined>(undefined);

    // Check if there's saved context in localStorage for this app
    useEffect(() => {
        if (preloadApp && typeof window !== 'undefined') {
            try {
                const savedContext = localStorage.getItem(`app_context_${preloadApp}`);
                if (savedContext) {
                    setInitialContext(JSON.parse(savedContext));
                    
                    // Optionally clear the context after using it
                    // localStorage.removeItem(`app_context_${preloadApp}`);
                }
            } catch (error) {
                console.error("Error loading app context:", error);
            }
        }
    }, [preloadApp]);

    return (
        <Desktop preloadApp={preloadApp} initialContext={initialContext} />
    )
}
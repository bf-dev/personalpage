"use client";

import { AppList } from "@/components/apps/AppList";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "@/components/hooks/useAppContext";

export default function AppPage() {
    const router = useRouter();
    const appId = useParams().id as string | undefined;
    if (!appId) {
        return notFound();
    }
    
    // Use our custom hook to manage context
    const { context, createLaunchAppHandler } = useAppContext(appId);
    
    const selectedApp = AppList.find(app => app.id === appId);

    if (!selectedApp) {
        return notFound();
    }

    // Create the mobile-friendly launch app handler
    const handleLaunchApp = createLaunchAppHandler(router);

    // Create props object for the app component
    const appProps = {
        context,
        onLaunchApp: handleLaunchApp,
        onClose: () => router.push('/')
    };

    return (
        <>
            {selectedApp.getComponent(appProps)}
            </>
    );
}
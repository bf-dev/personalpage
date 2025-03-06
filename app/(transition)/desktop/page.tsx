"use client";
import Desktop from "@/components/desktop/Desktop";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function DesktopPage() {
    return (
        <Suspense fallback={<div className="text-white">Loading...</div>}>
            <DesktopContent />
        </Suspense>
    )
}

function DesktopContent() {
    const preloadApp = useSearchParams().get("preloadApp") || undefined;
    return (
        <Desktop preloadApp={preloadApp} />
    )
}
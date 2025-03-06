"use client";
import Desktop from "@/components/desktop/Desktop";
import { useSearchParams } from "next/navigation";

export default function DesktopPage() {
    const preloadApp = useSearchParams().get("preloadApp") || undefined;
    return (
        <Desktop preloadApp={preloadApp} />
    )
}
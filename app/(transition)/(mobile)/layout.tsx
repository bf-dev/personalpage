"use client";
import { useState } from "react";
import { useEffect } from "react";
import Background from "./Background";
import MobileMenu from "./MobileMenu";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Desktop from "@/components/desktop/Desktop";
export default function MobileLayout({ children }: { children: React.ReactNode }) {
    const [screenWidth, setScreenWidth] = useState(0);
    const [isDesktop, setIsDesktop] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setScreenWidth(window.innerWidth);
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    useEffect(() => {
        if (screenWidth > 768) {
            const appId = pathname.split("/").pop();
            if (isRedirecting) return;
            setIsRedirecting(true)
            router.prefetch(`/desktop?preloadApp=${appId}`);
            setTimeout(() => {
                setIsDesktop(true);
                setTimeout(() => {
                    router.push(`/desktop?preloadApp=${appId}`);
                }, 1000);
            }, 1000);
        } else {
            setIsDesktop(false);
        }
    }, [screenWidth]);


    return (
        <>
            
            <AnimatePresence>
                {!isDesktop && (
                    <motion.div
                        className="relative"
                        initial={{ opacity: 1, top: 0 }}
                        exit={{ opacity: 0, top: 100 }}
                        transition={{ duration: 0.5, ease: "circIn" }}>
                        <MobileMenu />
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {!isDesktop && (
                <motion.div className="text-white relative max-w-xl mx-auto bg-black/80 backdrop-blur-2xl h-screen overflow-y-scroll"
                    initial={{ opacity: 1, top: "0" }}
                    exit={{ top: "100vh" }}
                    transition={{ duration: 0.5, ease: "circInOut" }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
            <p className='absolute bottom-1 text-xs opacity-50 text-white left-0 right-0 mx-auto text-center'>
                    Please visit on a larger screen for the best experience
                </p>
        </>
    );
}
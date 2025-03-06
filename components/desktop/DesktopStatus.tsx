import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AppList } from "../apps/AppList";

export default function DesktopStatus({ currentWindow }: { currentWindow: string }) {
    const [datetimeString, setDatetimeString] = useState("");
    useEffect(() => {
        const interval = setInterval(() => {
            //format of Thu Mar 6 2:54 PM
            //get rid of at
            setDatetimeString(new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }).replace("at", "\t"));
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const [appId, setAppId] = useState("");
    useEffect(() => {
        setAppId(AppList.find(app => app.title === currentWindow)?.id || "");
    }, [currentWindow]);
    return (
        <motion.div
            className="absolute flex px-3 py-1 text-xs text-white top-0 w-screen bg-black/40 backdrop-blur-2xl gap-x-3"
            style={{ zIndex: 0 }}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 25
            }}
        >
            <p className="font-mono">
                <svg viewBox="0 0 500 500" className="w-3 h-3 inline-block relative bottom-[0.5px] fill-white">
                    <path className="cls-1" d="m146.41,258.11S95.41,111.11,299.41,16.11s303,264,53,195-206,47-206,47Z" />
                    <path className="cls-1" d="m354.62,241.54s51,147-153,242-303-264-53-195,206-47,206-47Z" />
                    <path className="cls-1" d="m242.48,145.35s147-51,242,153-264,303-195,53c69-250-47-206-47-206Z" />
                    <path className="cls-1" d="m258.11,354.65S111.11,405.65,16.11,201.65C-78.89-2.35,280.11-101.35,211.11,148.65c-69,250,47,206,47,206Z" />
                </svg>
            </p>
            <div>
                <strong>
                    {currentWindow}
                </strong>
            </div>
            <div>
                <Link href={`/${appId}`}>
                    <p>Exit Desktop</p>
                </Link>
            </div>
            <div className="flex-1">

            </div>
            <div>
                <p>{datetimeString}</p>
            </div>
        </motion.div>
    )
}
import { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { AppList } from '../apps/AppList';
import { DesktopStatusProps } from './types';
import { useRouter } from 'next/navigation';

const DesktopStatus = ({ currentWindow }: DesktopStatusProps) => {
	const router = useRouter();
	const [datetimeString, setDatetimeString] = useState('');
	const [appId, setAppId] = useState('');

	// Update time every second
	useEffect(() => {
		const updateDateTime = () => {
			setDatetimeString(
				new Date().toLocaleString('en-US', {
					weekday: 'short',
					month: 'short',
					day: 'numeric',
					hour: 'numeric',
					minute: 'numeric',
					hour12: true,
				})
			);
		};

		// Update immediately and then every second
		updateDateTime();
		const interval = setInterval(updateDateTime, 1000);
		return () => clearInterval(interval);
	}, []);

	// Find app ID when currentWindow changes
	useEffect(() => {
		setAppId(AppList.find(app => app.title === currentWindow)?.id || '');
	}, [currentWindow]);

	// Handle exit desktop click - use router for programmatic navigation
	const handleExitDesktop = useCallback(() => {
		if (appId) {
			router.push(`/${appId}`);
		} else {
			// Fallback to chat app if no app ID found
			router.push('/chat');
		}
	}, [appId, router]);

	return (
		<motion.div
			className="absolute flex px-3 py-1 text-xs text-white top-0 w-screen bg-black/40 backdrop-blur-2xl gap-x-3"
			style={{ zIndex: 0 }}
			initial={{ y: -50, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{
				type: 'spring',
				stiffness: 300,
				damping: 25,
			}}
		>
			<p className="font-mono">
				<svg
					viewBox="0 0 500 500"
					className="w-3 h-3 inline-block relative bottom-[0.5px] fill-white"
				>
					<path
						className="cls-1"
						d="m146.41,258.11S95.41,111.11,299.41,16.11s303,264,53,195-206,47-206,47Z"
					/>
					<path
						className="cls-1"
						d="m354.62,241.54s51,147-153,242-303-264-53-195,206-47,206-47Z"
					/>
					<path
						className="cls-1"
						d="m242.48,145.35s147-51,242,153-264,303-195,53c69-250-47-206-47-206Z"
					/>
					<path
						className="cls-1"
						d="m258.11,354.65S111.11,405.65,16.11,201.65C-78.89-2.35,280.11-101.35,211.11,148.65c-69,250,47,206,47,206Z"
					/>
				</svg>
			</p>
			<div>
				<strong>{currentWindow}</strong>
			</div>
			{appId && (
				<div>
					<button onClick={handleExitDesktop} className="hover:text-white/70">
						Exit Desktop
					</button>
				</div>
			)}
			<div className="flex-1" />
			<div>
				<p>{datetimeString}</p>
			</div>
		</motion.div>
	);
};

export default memo(DesktopStatus);

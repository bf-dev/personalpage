'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
const menuItems = [
	{ label: 'main', href: '/' },
	{ label: 'about', href: '/about' },
	{ label: 'playground', href: '/playground' },
	{ label: 'thoughts', href: '/thoughts' },
];

export default function CompactMenu() {
	const router = useRouter();
	const pathname = usePathname();
	const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
	const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
	const [hoverStyles, setHoverStyles] = React.useState({ left: 0, width: 0 });

	const updateHoverPosition = (button: HTMLButtonElement | null) => {
		if (!button) {
			setHoverStyles({ left: 0, width: 0 });
			return;
		}
		const rect = button.getBoundingClientRect();
		const navRect = button.parentElement?.getBoundingClientRect();
		if (navRect) {
			setHoverStyles({
				left: rect.left - navRect.left,
				width: rect.width,
			});
		}
	};

	// Calculate active button position
	React.useEffect(() => {
		const activeIndex = menuItems.findIndex(item => item.href === pathname);
		if (activeIndex !== -1) {
			updateHoverPosition(buttonRefs.current[activeIndex]);
		}
	}, [pathname]);

	return (
		<motion.div
			className="fixed bottom-0 left-0 right-0 p-4 z-50"
			exit={{
				bottom: -100,
			}}
			initial={{ bottom: -100 }}
			animate={{ bottom: 0 }}
			transition={{
				duration: 0.3,
				ease: 'backInOut',
			}}
		>
			<nav
				className="flex items-center justify-center space-x-1 rounded-full bg-gray-800/20 backdrop-blur-lg p-2 mx-auto 
        max-w-fit shadow-[inset_0_0_5px_#ffffff30] relative
        sm:min-w-[300px]
        xs:min-w-[280px]
        min-w-[240px]"
			>
				<div
					className="absolute transition-all duration-300 ease-in-out rounded-full bg-white/10"
					style={{
						left: hoverStyles.left,
						width: hoverStyles.width,
						height: '40px',
						opacity: hoveredItem ? 1 : 0,
					}}
				/>
				{menuItems.map((item, index) => (
					<button
						key={item.label}
						ref={el => {
							if (buttonRefs.current) {
								buttonRefs.current[index] = el;
							}
						}}
						onClick={() => router.push(item.href)}
						onMouseEnter={() => {
							setHoveredItem(item.label);
							updateHoverPosition(buttonRefs.current[index]);
						}}
						onMouseLeave={() => {
							setHoveredItem(null);
						}}
						className={cn(
							'flex items-center justify-center rounded-full text-white/60 transition-all hover:text-white/90 relative',
							pathname === item.href && 'text-white/90 bg-white/10',
							'h-10 sm:px-4 px-2 text-[13px] sm:text-sm '
						)}
					>
						<span className="relative z-10">{item.label}</span>
					</button>
				))}
			</nav>
		</motion.div>
	);
}

import { motion } from 'framer-motion';
export default function BottomToast() {
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
				className="flex items-center justify-center text-white/80 text-sm rounded-full bg-gray-800/20 backdrop-blur-lg p-2  px-3 mx-auto 
    max-w-fit shadow-[inset_0_0_1px_#ffffff30] relative
    sm:min-w-[300px]
    xs:min-w-[280px]
    min-w-[240px]"
			>
				For the best viewing experience, please visit on a larger screen 📱→💻
			</nav>
		</motion.div>
	);
}

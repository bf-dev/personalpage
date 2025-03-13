import { useState, useEffect } from 'react';
import { getScreenDimensions } from './utils';

/**
 * A hook that tracks screen dimensions and updates on resize
 */
export const useScreenDimensions = () => {
	const [screenDimensions, setScreenDimensions] = useState(getScreenDimensions());

	useEffect(() => {
		const updateDimensions = () => {
			setScreenDimensions(getScreenDimensions());
		};

		// Set dimensions on initial load
		updateDimensions();

		// Add event listener for window resize
		window.addEventListener('resize', updateDimensions);

		// Clean up event listener on component unmount
		return () => window.removeEventListener('resize', updateDimensions);
	}, []);

	return screenDimensions;
};

/**
 * A hook that manages the desktop startup animation phases
 */
export const useStartupAnimation = () => {
	const [startupPhase, setStartupPhase] = useState<
		'initial' | 'background' | 'launcher' | 'complete'
	>('initial');

	useEffect(() => {
		// Start the animation sequence
		const animationSequence = async () => {
			// First phase - background appears
			setStartupPhase('background');

			// Second phase - launcher appears
			setTimeout(() => {
				setStartupPhase('launcher');
			}, 600);

			// Final phase - everything is loaded
			setTimeout(() => {
				setStartupPhase('complete');
			}, 1200);
		};

		animationSequence();
	}, []);

	return startupPhase;
};

/**
 * A hook that checks if the device is mobile and handles redirection
 */
export const useMobileRedirect = (
	screenDimensions: { width: number; height: number },
	getRedirectPath: () => string,
	onRedirect: () => void
) => {
	const [isRedirecting, setIsRedirecting] = useState(false);

	useEffect(() => {
		if (typeof window !== 'undefined' && screenDimensions.width < 768) {
			if (isRedirecting) return;

			setIsRedirecting(true);
			onRedirect();
		}
	}, [screenDimensions, isRedirecting, onRedirect, getRedirectPath]);

	return isRedirecting;
};

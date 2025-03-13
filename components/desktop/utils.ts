import { AppContext } from '../apps/AppList';
import { WindowInstance } from './types';

/**
 * Creates a window instance for desktop
 */
export const createWindowInstance = (
	appId: string,
	title: string,
	content: React.ReactNode,
	zIndex: number,
	initialX: number,
	initialY: number,
	width: number,
	height: number,
	isPreload: boolean = false,
	context?: AppContext
): WindowInstance => {
	const windowId = `window-${appId}-${Date.now()}`;

	return {
		id: windowId,
		appId,
		title,
		content,
		zIndex,
		isMaximized: false,
		isFocused: true,
		initialX,
		initialY,
		width,
		height,
		isPreloadApp: isPreload,
		context,
	};
};

/**
 * Calculate window position (centered or random)
 */
export const calculateWindowPosition = (
	centerPosition: boolean,
	screenWidth: number,
	screenHeight: number,
	windowWidth: number,
	windowHeight: number
) => {
	if (centerPosition) {
		// Center the window in the screen
		return {
			initialX: (screenWidth - windowWidth) / 2,
			initialY: (screenHeight - windowHeight) / 2,
		};
	} else {
		// Generate random position within the visible screen area
		const padding = 50;
		const maxX = screenWidth - windowWidth - padding;
		const maxY = screenHeight - windowHeight - padding;

		return {
			initialX: Math.floor(Math.random() * (maxX - padding)) + padding,
			initialY: Math.floor(Math.random() * (maxY - padding)) + padding,
		};
	}
};

/**
 * Get current screen dimensions
 */
export const getScreenDimensions = () => {
	return {
		width: typeof window !== 'undefined' ? window.innerWidth : 1200,
		height: typeof window !== 'undefined' ? window.innerHeight : 800,
	};
};

import { useState, useCallback, useRef } from 'react';
import { WindowInstance } from './types';
import { AppContext, AppList } from '../apps/AppList';
import { createWindowInstance, calculateWindowPosition } from './utils';

/**
 * Custom hook to manage desktop windows
 */
export const useWindowManager = (screenDimensions: { width: number; height: number }) => {
	const [windows, setWindows] = useState<WindowInstance[]>([]);
	const [highestZIndex, setHighestZIndex] = useState(10);

	// Use a ref to track app loading status and prevent duplicates during concurrent operations
	const appLoadingRef = useRef<Record<string, boolean>>({});

	// Add a flag to track focus operations in progress
	const focusOperationInProgress = useRef(false);

	// Get launched app IDs
	const getLaunchedAppIds = useCallback(() => {
		return windows.map(window => window.appId);
	}, [windows]);

	// Get current focused window or title
	const getFocusedWindow = useCallback(() => {
		return windows.find(window => window.isFocused);
	}, [windows]);

	// Launch an app with debouncing to prevent multiple launches
	const launchApp = useCallback(
		(
			appId: string,
			centerPosition: boolean = false,
			context?: AppContext,
			isPreload: boolean = false,
			onCreateProps?: (windowId: string) => Record<string, unknown>
		) => {
			// Check if app is available
			const appToLaunch = AppList.find(app => app.id === appId);
			if (!appToLaunch) return;

			// Don't allow duplicate launches in rapid succession
			if (appLoadingRef.current[appId]) {
				return;
			}

			appLoadingRef.current[appId] = true;

			// Clear loading flag after a short delay
			setTimeout(() => {
				appLoadingRef.current[appId] = false;
			}, 500);

			// Set focus operation flag to prevent concurrent focus operations
			focusOperationInProgress.current = true;

			setWindows(prevWindows => {
				// Check if app is already launched
				const existingWindowIndex = prevWindows.findIndex(window => window.appId === appId);

				if (existingWindowIndex >= 0) {
					// Focus the existing window instead of launching a new instance
					const newZIndex = highestZIndex + 1;
					setHighestZIndex(newZIndex);

					// Clear focus operation flag after state update
					setTimeout(() => {
						focusOperationInProgress.current = false;
					}, 100);

					return prevWindows.map((window, index) =>
						index === existingWindowIndex
							? {
									...window,
									zIndex: newZIndex,
									isFocused: true,
									context: context || window.context,
								}
							: { ...window, isFocused: false }
					);
				}

				try {
					// Use app-specific width/height if provided, otherwise default values
					const windowWidth = appToLaunch.width || 400;
					const windowHeight = appToLaunch.height || 300;

					// Calculate position
					const { initialX, initialY } = calculateWindowPosition(
						centerPosition,
						screenDimensions.width,
						screenDimensions.height,
						windowWidth,
						windowHeight
					);

					// Create window ID
					const newWindowId = `window-${appId}-${Date.now()}`;

					// Create standard context for app if none provided
					const appContext = context || {
						data: {},
						source: 'desktop',
						timestamp: Date.now(),
					};

					// Allow customizing props if needed
					const appProps = onCreateProps
						? onCreateProps(newWindowId)
						: {
								context: appContext,
								onLaunchApp: () => {}, // Will be properly set by the consumer
								onClose: () => {}, // Will be properly set by the consumer
							};

					const newZIndex = highestZIndex + 1;
					setHighestZIndex(newZIndex);

					// Create new window with dynamic content
					const newWindow = createWindowInstance(
						appToLaunch.id,
						appToLaunch.title,
						appToLaunch.getComponent(appProps),
						newZIndex,
						initialX,
						initialY,
						windowWidth,
						windowHeight,
						isPreload,
						appContext
					);

					// Clear focus operation flag after state update
					setTimeout(() => {
						focusOperationInProgress.current = false;
					}, 100);

					// Unfocus all other windows and add new one
					return [
						...prevWindows.map(window => ({
							...window,
							isFocused: false,
						})),
						newWindow,
					];
				} catch (error) {
					console.error(`Error launching app ${appId}:`, error);
					// Clear focus operation flag on error
					focusOperationInProgress.current = false;
					// Return unchanged state on error
					return prevWindows;
				}
			});
		},
		[highestZIndex, screenDimensions]
	);

	// Close a window
	const closeWindow = useCallback((windowId: string) => {
		setWindows(prevWindows => prevWindows.filter(window => window.id !== windowId));
	}, []);

	// Maximize/restore a window
	const toggleMaximize = useCallback((windowId: string) => {
		setWindows(prevWindows =>
			prevWindows.map(window =>
				window.id === windowId ? { ...window, isMaximized: !window.isMaximized } : window
			)
		);
	}, []);

	// Focus a window with debounce to prevent multiple rapid focus changes
	const focusWindow = useCallback(
		(windowId: string) => {
			if (!windowId) return;

			// Skip if another focus operation is in progress
			if (focusOperationInProgress.current) {
				console.debug('Skipping focus operation due to another in progress');
				return;
			}

			// Set focus operation flag
			focusOperationInProgress.current = true;

			console.debug('focus window', windowId);

			setWindows(prevWindows => {
				// If window is already focused, just update the flag and return unchanged
				if (prevWindows.some(window => window.id === windowId && window.isFocused)) {
					focusOperationInProgress.current = false;
					return prevWindows;
				}

				const newZIndex = highestZIndex + 1;
				setHighestZIndex(newZIndex);

				return prevWindows.map(window => ({
					...window,
					zIndex: window.id === windowId ? newZIndex : window.zIndex,
					isFocused: window.id === windowId,
				}));
			});

			// Clear focus operation flag after a short delay
			setTimeout(() => {
				focusOperationInProgress.current = false;
			}, 100);
		},
		[highestZIndex]
	);

	// Close all windows
	const closeAllWindows = useCallback(() => {
		setWindows([]);
	}, []);

	return {
		windows,
		getLaunchedAppIds,
		getFocusedWindow,
		launchApp,
		closeWindow,
		toggleMaximize,
		focusWindow,
		closeAllWindows,
	};
};

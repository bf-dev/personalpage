import { ReactNode, CSSProperties } from 'react';
import { AppContext, AppDefinition } from '../apps/AppList';

// Window instance shared interface
export interface WindowInstance {
	id: string;
	appId: string;
	title: string;
	content: ReactNode;
	zIndex: number;
	isMaximized: boolean;
	isFocused: boolean;
	initialX: number;
	initialY: number;
	width: number;
	height: number;
	isPreloadApp: boolean;
	context?: AppContext;
}

// Desktop component props
export interface DesktopProps {
	preloadApp?: string;
	initialContext?: AppContext;
}

// Desktop window props
export interface DesktopWindowProps {
	children?: ReactNode;
	width?: number;
	height?: number;
	screenWidth: number;
	screenHeight: number;
	onClose: () => void;
	onMaximize: () => void;
	onFocus?: () => void;
	initialX?: number;
	initialY?: number;
	style?: CSSProperties;
	isPreloadApp?: boolean;
}

// Desktop launcher props
export interface DesktopLauncherProps {
	apps: AppDefinition[];
	launchedApps: string[];
	onLaunchApp: (
		appId: string,
		centerPosition?: boolean,
		context?: AppContext,
		isPreload?: boolean
	) => void;
	startupPhase: 'initial' | 'background' | 'launcher' | 'complete';
}

// Desktop status props
export interface DesktopStatusProps {
	currentWindow: string;
}

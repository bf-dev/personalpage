import { lazy, Suspense, ComponentType } from 'react';
import {
	MessageCircle,
	User,
	Cat,
	Flag as FlagIcon,
	Keyboard,
	TreePalm,
	Folder as FolderIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Folder from './folder/Folder';
import Image from 'next/image';


const About = lazy(() => import('./about/About'));
const ChatInteraction = lazy(() => import('./chat/Chat'));
const Typewriter = lazy(() => import('./typewriter/Typewriter'));


export interface AppContext {
	data: Record<string, unknown>;
	source: string;
	timestamp: number;
}

export interface AppProps {
	context?: AppContext;
	onLaunchApp?: (appId: string, centerPosition?: boolean, context?: AppContext) => void;
	onClose?: () => void;
}


const withAppProps = <T extends object>(Component: ComponentType<T>) => {
	return function WrappedComponent(props: T & AppProps) {
		
		return <Component {...props} />;
	};
};


const AppAbout = withAppProps(About);
const AppChat = withAppProps(ChatInteraction);
const AppTypewriter = withAppProps(Typewriter);

export interface AppDefinition {
	id: string;
	title: string;
	icon: LucideIcon;
	getComponent: (props: AppProps) => React.ReactNode;
	width?: number;
	height?: number;
	isHidden?: boolean;
	capabilities?: {
		canLaunchApps?: boolean;
		canReceiveContext?: boolean;
		canProvideContext?: boolean;
		persistData?: boolean;
	};
}

type MenuDefinition = {
	id: string;
	title: string;
	icon: string;
	href: string;
	isHidden?: boolean;
};


const LoadingFallback = () => (
	<div className="flex items-center justify-center h-full w-full">
		{/* Empty div for blank loading state */}
	</div>
);

export const AppList: AppDefinition[] = [
	{
		id: 'chat',
		title: 'Chat',
		icon: MessageCircle,
		width: 400,
		height: 600,
		getComponent: (props: AppProps) => (
			<div className="p-4 text-white h-full">
				<Suspense fallback={<LoadingFallback />}>
					<AppChat {...props} />
				</Suspense>
			</div>
		),
		isHidden: false,
		capabilities: {
			canLaunchApps: true,
			canReceiveContext: true,
			canProvideContext: true,
		},
	},
	{
		id: 'about',
		title: 'About',
		icon: User,
		width: 400,
		height: 600,
		getComponent: (props: AppProps) => (
			<div className="p-4 text-white h-full">
				<Suspense fallback={<LoadingFallback />}>
					<AppAbout {...props} />
				</Suspense>
			</div>
		),
		isHidden: false,
		capabilities: {
			canLaunchApps: true,
		},
	},
	{
		id: 'kitten',
		title: 'Kitten',
		icon: Cat,
		width: 768 / 3,
		height: 1024 / 3 + 24,
		getComponent: () => (
			<div className="text-white w-full h-[341.33px] mt-[6px]">
				<Image src="/kitten.jpeg" alt="kitten" height={1024 / 3} width={768 / 3} />
			</div>
		),
		isHidden: true,
		capabilities: {},
	},
	{
		id: 'flag',
		title: 'Flag',
		icon: FlagIcon,
		width: 300,
		height: 200,
		getComponent: () => (
			<div className="text-white h-[176px] w-full">
				<div className="w-full h-2/5 bg-[#D60270]"></div>
				<div className="w-full h-1/5 bg-[#9B4F96]"></div>
				<div className="w-full h-2/5 bg-[#0038A8]"></div>
			</div>
		),
		isHidden: true,
		capabilities: {},
	},
	{
		id: 'typewriter',
		title: 'Typewriter',
		icon: Keyboard,
		width: 720,
		height: 320,
		getComponent: (props: AppProps) => (
			<Suspense fallback={<LoadingFallback />}>
				<AppTypewriter {...props} />
			</Suspense>
		),
		isHidden: false,
		capabilities: {
			canLaunchApps: true,
			canReceiveContext: true,
			canProvideContext: true,
		},
	},
	{
		id: 'thoughts',
		title: 'Thoughts',
		icon: TreePalm,
		width: 320,
		height: 480,
		getComponent: () => (
			<div className="text-white h-full w-full px-4 pt-2">
				<h3 className="text-lg font-semibold">Thoughts</h3>
				<div className="flex flex-col gap-y-2 py-2">
					<div className="bg-black/30 p-2 rounded-md">
						<p className="">Working in Progress</p>
						<p className="text-sm text-white/50">I&apos;m working on it!</p>
					</div>
				</div>
			</div>
		),
		isHidden: true,
		capabilities: {},
	},

	
	{
		id: 'all-apps',
		title: 'All Apps',
		icon: FolderIcon,
		width: 500,
		height: 550,
		getComponent: (props: AppProps) => (
			<Suspense fallback={<LoadingFallback />}>
				<Folder
					{...props}
					appIds={['flag', 'kitten', 'thoughts', 'typewriter']}
					title="All Applications"
				/>
			</Suspense>
		),
		isHidden: false,
		capabilities: {
			canLaunchApps: true,
		},
	},
];

export const MenuList: MenuDefinition[] = AppList.map(app => ({
	id: app.id,
	title: app.title,
	icon: app.icon.name,
	href: `/${app.id}`,
	isHidden: app.isHidden || false,
}));

import { motion } from 'framer-motion';
import { AppList, AppProps } from '../AppList';
import { useDeviceDetect } from '@/components/hooks/useDeviceDetect';

interface FolderProps extends AppProps {
	appIds?: string[];
	title?: string;
}

export default function Folder({ appIds = [], title, onLaunchApp }: FolderProps) {
	const folderApps = AppList.filter(app => appIds.includes(app.id));

	const { isMobile } = useDeviceDetect();

	return (
		<div className="h-full w-full flex flex-col">
			{title && (
				<div className="px-4 py-2 text-white/70">
					<h2 className="text-lg font-medium">{title}</h2>
				</div>
			)}
			<div className="flex-1 p-4 overflow-auto">
				<div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4`}>
					{folderApps.map(app => {
						const Icon = app.icon;
						return (
							<motion.button
								key={app.id}
								className="flex flex-col items-center justify-center p-3 rounded-lg bg-black/10 hover:bg-white/10 transition-all"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => onLaunchApp && onLaunchApp(app.id, true)}
							>
								<Icon className="w-8 h-8 text-white mb-2" />
								<span className="text-sm text-white">{app.title}</span>
							</motion.button>
						);
					})}
				</div>
			</div>
		</div>
	);
}

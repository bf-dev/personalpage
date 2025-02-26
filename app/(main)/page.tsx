import ChatInteraction from './ChatInteraction';
import Background from './Background';
import VisitLogger from './VisitLogger';

'use client';

export default function Home() {
	return (
		<div className="relative bg-gray">
			<VisitLogger />
			<Background />

			<div className="relative p-5 container bg-black mx-auto max-w-xl min-h-screen text-white z-10">
				<h1 className="text-lg -mb-1">insung cho</h1>
				<h1 className="opacity-70">
					I make things <i>happen</i>
				</h1>
				<hr className="my-3 opacity-70" />

				<div className="space-y-6">
					<ChatInteraction />
				</div>
			</div>
		</div>
	);
}

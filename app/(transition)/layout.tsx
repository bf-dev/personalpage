import Background from './(mobile)/Background';

export default function TransitionLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Background />
			{children}
		</>
	);
}

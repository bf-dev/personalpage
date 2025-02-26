import ContactsList from '@/app/about/ContactsList';
import Background from '../(main)/Background';
import Introduction from '@/app/about/Introduction';
export default function Contacts() {
	return (
		<>
			<Background />
			<div className="relative p-5 container bg-black mx-auto max-w-xl min-h-screen text-white z-10">
				<h1 className="text-lg -mb-1">insung cho</h1>
				<h1 className="opacity-70">
					I make things <i>happen</i>
				</h1>
				<hr className="my-3 opacity-70" />
				<Introduction />
				<ContactsList />
			</div>
		</>
	);
}

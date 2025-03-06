import ContactsList from '@/components/apps/about/ContactsList';
import Introduction from '@/components/apps/about/Introduction';
export default function Contacts() {
	return (
		<>
			<h1 className="text-lg -mb-1">insung cho; aka bf</h1>
			<h1 className="opacity-70">
				I make things <i>happen</i>
			</h1>
			<hr className="my-3 opacity-70" />
			<Introduction />
			<ContactsList />
		</>
	);
}

import React from 'react';
import { Mail, Github, Globe, MessageCircle, Send, Instagram } from 'lucide-react';
import Link from 'next/link';
import { AnimatedItem } from '../../AnimatedItem';

interface ContactItem {
	icon: React.ReactNode;
	label: string;
	handle: string;
	href: string;
}

export default function ContactsList() {
	const contacts: ContactItem[] = [
		// ... existing code ...
	];

	return (
		<div className="mt-4">
			<div className="flex flex-col space-y-2">
				{contacts.map((contact, index) => (
					<AnimatedItem key={index} index={index}>
						<Link
							href={contact.href}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors duration-300"
						>
							{contact.icon}
							<span className="opacity-70">{contact.label}</span>
							<span>{contact.handle}</span>
						</Link>
					</AnimatedItem>
				))}
			</div>
		</div>
	);
} 
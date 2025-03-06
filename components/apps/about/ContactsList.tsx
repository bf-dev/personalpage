'use client';
import React from 'react';
import { Mail, Github, Globe, MessageCircle, Send, Instagram } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ContactItem {
	icon: React.ReactNode;
	label: string;
	handle: string;
	href: string;
}

export default function ContactsList() {
	const contacts: ContactItem[] = [
		{
			icon: <Mail size={16} />,
			label: 'email',
			handle: 'bfdev+pub@icloud.com',
			href: 'mailto:bfdev+pub@icloud.com',
		},
		{
			icon: <Github size={16} />,
			label: 'github',
			handle: 'bf-dev',
			href: 'https://github.com/bf-dev',
		},
		{
			icon: <Instagram size={16} />,
			label: 'instagram',
			handle: '@seonign',
			href: 'https://instagram.com/seonign',
		},
		{
			icon: <Globe size={16} />,
			label: 'website',
			handle: 'neowiki.one',
			href: 'https://neowiki.one',
		},
		{
			icon: <Send size={16} />,
			label: 'telegram',
			handle: '@bfdevtg',
			href: 'https://t.me/bfdevtg',
		},
		{
			icon: <MessageCircle size={16} />,
			label: 'discord',
			handle: '@klyxxor',
			href: 'https://discord.com/users/klyxxor',
		},
	];

	return (
		<div className="mt-4">
			<div className="flex flex-col space-y-2">
				{contacts.map((contact, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.7,
							delay: index * 0.1,
							ease: "easeOut"
						}}
					>
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
					</motion.div>
				))}
			</div>
		</div>
	);
}

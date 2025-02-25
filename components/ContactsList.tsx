import React from 'react';
import { Mail, Github, Globe, MessageCircle, Send, Instagram } from 'lucide-react';
import Link from 'next/link';

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
      label: 'Email',
      handle: 'bfdev+pub@icloud.com',
      href: 'mailto:bfdev+pub@icloud.com'
    },
    {
      icon: <Github size={16} />,
      label: 'GitHub',
      handle: 'bf-dev',
      href: 'https://github.com/bf-dev'
    },
    {
      icon: <Instagram size={16} />,
      label: 'Instagram',
      handle: '@seonign',
      href: 'https://instagram.com/seonign'
    },
    {
      icon: <Globe size={16} />,
      label: 'Website',
      handle: 'neowiki.one',
      href: 'https://neowiki.one'
    },
    {
      icon: <Send size={16} />,
      label: 'Telegram',
      handle: '@bfdevtg',
      href: 'https://t.me/bfdevtg'
    },
    {
      icon: <MessageCircle size={16} />,
      label: 'Discord',
      handle: '@klyxxor',
      href: 'https://discord.com/users/klyxxor'
    }
  ];

  return (
    <div className="mt-4">
      <div className="flex flex-col space-y-2">
        {contacts.map((contact, index) => (
          <Link 
            key={index} 
            href={contact.href}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors duration-300"
          >
            {contact.icon}
            <span className="opacity-70">{contact.label}</span>
            <span>{contact.handle}</span>
          </Link>
        ))}
      </div>
    </div>
  );
} 
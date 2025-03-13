'use client';
import { ChatMessageData, ChatMessageProvider } from '@/components/apps/chat/ChatMessage';
import { useEffect, useState, useCallback } from 'react';
import { AppProps } from '../AppList';

interface ChatMessageWithButtons extends ChatMessageData {
	buttons?: string[];
	onButtonClick?: (buttonText: string) => void;
}

export default function ChatInteraction({ context, onLaunchApp }: AppProps) {
	const [messages, setMessages] = useState<ChatMessageWithButtons[]>([]);
	const [referrer, setReferrer] = useState<string | null>(null);

	useEffect(() => {
		if (context && context.data) {
			setTimeout(() => {
				setMessages(prev => {
					return [
						...prev,
						{
							content: `Received data from ${context.source}: ${JSON.stringify(context.data)}`,
							side: 'left',
						},
					];
				});
			}, 1000);
		}
	}, [context]);

	const createAppLaunchHandler = useCallback(
		(appId: string) => () => {
			if (onLaunchApp) onLaunchApp(appId);
		},
		[onLaunchApp]
	);

	const handleButtonClick = useCallback(
		(buttonText: string) => {
			setMessages(prev => {
				const updatedMessages = prev.map(msg => {
					if (msg.buttons) {
						return { ...msg, buttons: undefined };
					}
					return msg;
				});

				return [...updatedMessages, { content: buttonText, side: 'right' }];
			});

			if (buttonText === 'Who are you?') {
				setTimeout(() => {
					setMessages(prev => {
						return [
							...prev,
							{
								content:
									"I'm Insung Cho, a creator of this website. I'm passionate about building meaningful experiences and connecting with people. Thanks for visiting my personal site!",
								side: 'left',
							},
						];
					});
				}, 1000);
			}
			if (buttonText === '한국어?') {
				setTimeout(() => {
					setMessages(prev => {
						return [
							...prev,
							{
								content:
									'미안해요. 제 부족함으로 인해 이 웹페이지는 영어만 지원합니다.',
								side: 'left',
								buttons: ['Who are you?', 'Contact Me', 'Explore Playground'],
							},
						];
					});
				}, 1000);
			}

			if (buttonText === 'Open Calculator') {
				createAppLaunchHandler('calculator')();
			}

			if (buttonText === 'Open Typewriter') {
				createAppLaunchHandler('typewriter')();
			}
		},
		[createAppLaunchHandler]
	);

	useEffect(() => {
		const hash = window.location.hash.slice(1);
		const referrers: Record<string, string> = {
			i: 'Instagram',
			g: 'GitHub',
			t: 'Telegram',
			d: 'Discord',
		};

		if (hash && referrers[hash.toLowerCase()]) {
			setReferrer(referrers[hash.toLowerCase()]);
		}
	}, []);

	useEffect(() => {
		const now = new Date();
		const formattedTime = now.toLocaleString('en-US', {
			weekday: 'short',
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		});

		const initialMessages: ChatMessageWithButtons[] = [
			{ content: formattedTime, side: 'timestamp' },
			{ content: 'Hello there! 👋', side: 'left' },
		];

		if (referrer) {
			initialMessages.push({
				content: `I see you came from ${referrer}! Thanks for visiting!`,
				side: 'left',
			});
		}

		initialMessages.push(
			{ content: 'Hi! 👋', side: 'right' },
			{ content: "I'm Insung Cho.", side: 'left' },
			{
				content: 'Welcome to my personal site! How can I help you today?',
				side: 'left',
				buttons: ['Who are you?', '한국어?', 'Open Calculator', 'Open Typewriter'],
				onButtonClick: handleButtonClick,
			}
		);

		setMessages(initialMessages);
	}, [referrer, handleButtonClick]);

	return (
		<div>
			<ChatMessageProvider
				messages={messages}
				delay={300}
				typeDelays={{
					timestamp: 100,
					left: 500,
					right: 200,
				}}
				animated={true}
				onButtonClick={handleButtonClick}
			/>
		</div>
	);
}

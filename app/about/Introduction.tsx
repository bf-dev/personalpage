'use client';
import { AnimatedItem } from '@/components/AnimatedItem';

const Introduction: React.FC = () => {
	const sections = [
		{
			title: 'brief introduction',
			items: [
				'born in 2006 in south korea',
				'living in tianjin, china'
			]
		},
		{
			title: 'what-i-like',
			items: [
				'programming; made 20+ projects in 8 years',
				'music; fav: @nemothings',
				'literature; video gaming;'
			]
		},
		{
			title: 'details',
			items: [
				'he/him; b',
				'english, korean',
				'utc+8'
			]
		}
	];

	let itemIndex = 0;

	return (
		<div>
			{sections.map((section) => (
				<div key={section.title}>
					<AnimatedItem index={itemIndex++}>
						<h3>{section.title}</h3>
					</AnimatedItem>
					<ul className="opacity-70">
						{section.items.map((item) => (
							<AnimatedItem key={item} index={itemIndex++}>
								<li>{item}</li>
							</AnimatedItem>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};

export default Introduction;

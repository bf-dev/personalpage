export const typewriter_words = [
	'awe-inspiring',
	'radiant',
	'ethereal',
	'exquisite',
	'breathtaking',
	'magnificent',
	'sublime',
	'vibrant',
	'resplendent',
	'elegant',
	'divine',
	'majestic',
	'glorious',
	'enchanting',
	'mystical',
	'poignant',
	'intoxicating',
	'vivid',
	'dynamic',
	'incandescent',
	'sparkling',
	'tranquil',
	'celestial',
	'luminous',
	'radiating',
	'venerable',
	'captivating',
	'fascinating',
	'transcendent',
	'splendid',
	'glimmering',
	'immaculate',
	'pensive',
	'romantic',
	'harmonious',
	'vital',
	'energetic',
	'enraptured',
	'optimistic',
	'passionate',
	'heartfelt',
	'ardent',
	'vivacious',
	'dreamy',
	'mellifluous',
	'serene',
	'soulful',
	'uplifting',
	'exhilarating',
	'compelling',
	'invigorating',
	'electrifying',
	'inspiring',
	'joyous',
	'glittering',
	'heavenly',
	'fervent',
	'exultant',
	'rhapsodic',
	'blissful',
	'luscious',
	'opulent',
	'thrilling',
	'fanciful',
	'whimsical',
	'imaginative',
	'zealous',
	'exuberant',
	'lively',
	'sincere',
	'hopeful',
	'miraculous',
	'spellbinding',
	'poetic',
	'effervescent',
	'enlightened',
	'charismatic',
	'dreamlike',
	'gorgeous',
	'fervid',
	'impeccable',
	'intriguing',
	'intense',
	'magnetic',
	'adorable',
	'resilient',
	'robust',
	'eloquent',
	'effortless',
	'grand',
	'noble',
	'heartwarming',
	'soothing',
	'brilliant',
	'dazzling',
	'transfixing',
	'tender',
	'graceful',
	'emotional',
	'amazing',
	'lovely',
	'shimmering',
	'bewitching',
	'alluring',
	'seductive',
	'pulsating',
	'euphoric',
	'otherworldly',
	'beatific',
	'felicitous',
	'transcending',
	'inimitable',
	'idyllic',
	'sacred',
	'reverent',
	'shining',
	'flourishing',
	'cherished',
	'precious',
	'treasured',
	'festive',
	'glowing',
	'magnanimous',
	'genuine',
	'authentic',
	'elegiac',
	'wistful',
	'nostalgic',
	'mystifying',
	'mesmeric',
	'entrancing',
	'exalting',
	'soaring',
	'elevated',
	'iridescent',
	'lustrous',
	'effulgent',
	'revered',
	'spectacular',
	'stunning',
	'impressive',
	'astonishing',
	'astounding',
	'marvelous',
	'incredible',
	'unforgettable',
	'charming',
	'gripping',
	'magical',
	'epic',
];

export function generateRandomText() {
	const selectedWords = [];
	const wordCount = 20;
	const availableWords = [...typewriter_words];

	while (availableWords.length < wordCount) {
		availableWords.push(...typewriter_words);
	}

	for (let i = 0; i < wordCount; i++) {
		const randomIndex = Math.floor(Math.random() * availableWords.length);
		selectedWords.push(availableWords[randomIndex]);
		availableWords.splice(randomIndex, 1);
	}

	return selectedWords.join(' ');
}

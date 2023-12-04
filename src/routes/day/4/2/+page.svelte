<script lang="ts">
	import { loadFile, delay } from '$lib/lib';
	import { onMount } from 'svelte';
	let originalData: string = '';
	onMount(async () => {
		originalData = await loadFile('data/day4.txt');
		data = originalData;

		run();
	});
	let data = '';
	let textData = '';
	let dataArr: (string | card)[] = [];
	type card = {
		id: number;
		myNumbers: number[];
		winningNumbers: number[];
		wins: number;
		winningCards: number[];
	};

	//card counter
	let sum = 0;
	// counts the total amount of one specific card
	let cardCounter: number[] = [];
	let cards: Map<number, card> = new Map();
	// que of the cards [index] is the card id value is the amount of times it is still in the queue
	let cardQueue: Map<number, number> = new Map();

	async function run() {
		// split the data into an array on every new line
		dataArr = data.split('\n');
		/**
 * Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
 */
		let regex = /Card +(\d+): ((?: ?\d+ +)+)\s*\|\s*((?: ?\d+ +)+\d+)/;
		cards = new Map();
		for (let line of dataArr) {
			if (typeof line === 'object') {
				continue;
			}
			let match = regex.exec(line);
			if (match) {
				let card: card = {
					id: parseInt(match[1]),
					// filter out empty string and
					myNumbers: match[2]
						.split(' ')
						.filter((n) => n !== '')
						.map((n) => parseInt(n)),
					winningNumbers: match[3]
						.split(' ')
						.filter((n) => n !== '')
						.map((n) => parseInt(n)),
					wins: 0,
					winningCards: []
				};
				cards.set(card.id, card);
			}
		}
		cards.forEach((card) => {
			card.wins = card.myNumbers.filter((n) => card.winningNumbers.includes(n)).length;
		});

		cards.forEach((card) => {
			const wins = card.wins;
			for (let i = 0; i < wins; i++) {
				card.winningCards.push(i + card.id + 1);
			}
		});

		// push all cards to the queue
		cards.forEach((card) => {
			cardQueue.set(card.id, 1);
		});
		const highest = Math.max(...cardQueue.keys());

		while (cardQueue.size > 0) {
			let currentQueueItem = cardQueue.entries().next();

			let cardId = currentQueueItem.value[0];
			let amount = currentQueueItem.value[1];
			if (amount === undefined) {
				continue;
			} else if (typeof amount !== 'number') {
				continue;
			}

			sum = sum + amount;
			if (!cardId) {
				continue;
			}
			let counter = cardCounter[cardId - 1];
			if (!counter) {
				counter = 0;
				cardCounter[cardId - 1] = counter;
			}
			counter++;
			cardCounter[cardId - 1] = counter;
			const card = cards.get(cardId);
			console.log(cardId);
			if (card) {
				card.winningCards.forEach((winningCard) => {
					if (winningCard > highest) {
						return;
					}

					let currentAmount = cardQueue.get(winningCard);
					if (!currentAmount) {
						currentAmount = 0;
					}
					currentAmount = currentAmount + amount;
					cardQueue.set(winningCard, currentAmount as number);
				});
			}
			cardQueue.delete(cardId);
		}
	}
</script>

<h1>Day 4 - part 2</h1>
<!-- link to day/1/2 -->
<h1>Input</h1>
<textarea bind:value={textData}></textarea>

{#if sum == 0}
	loading...
{:else}
	<h1>Result</h1>
	<p>{sum}</p>
{/if}

{#each cardCounter as counter, index}
	<div>
		<p>Card {index + 1}: {counter}</p>
	</div>
{/each}

<!-- {#each cards as card}
	<div>
		<h2>Card {card.id}</h2>
		<p>My numbers: {card.myNumbers.join(', ')}</p>
		<p>Winning numbers: {card.winningNumbers.join(', ')}</p>
		<p>winningCards: {card.winningCards}</p>
	</div>
{/each} -->

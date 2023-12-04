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
	let dataArr: (string|card)[] = [];
	type card = {
		id: number
		myNumbers: number[]
		winningNumbers: number[]
		wins: number,
		points: number
	}
	
	let sum = 0;
	let cards: card[] = [];

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
		cards = [];
		for (let line of dataArr) {
			if(typeof line === 'object'){
				continue;
			}
			let match = regex.exec(line);
			if (match) {
				let card: card = {
					id: parseInt(match[1]),
					// filter out empty string and
					myNumbers: match[2].split(' ').filter(n => n !== '').map(n => parseInt(n)),
					winningNumbers: match[3].split(' ').filter(n => n !== '').map(n => parseInt(n)),
					wins: 0,
					points: 0
				}
				cards.push(card);
			}
		}

		cards.forEach(card => {
			card.wins = card.myNumbers.filter(n => card.winningNumbers.includes(n)).length;
		});

		cards.forEach(card =>{
			// if(card.wins === 0){
			// 	card.points = 0;
			// } else if(card.wins === 1){
			// 	card.points = 1;
			// } else if(card.wins === 2){
			// 	card.points = 2;
			// } else if(card.wins === 3){
			// 	card.points = 4;
			// } else if(card.wins === 4){
			// 	card.points = 8;
			// } else if(card.wins === 5){
			// 	card.points = 16;
			// } else if(card.wins === 6){
			// 	card.points = 32;
			// } else if(card.wins === 7){
			// 	card.points = 64;
			// }
			// simply the above code
			if(card.wins === 0){
				card.points = 0;
			} else {
				card.points = Math.pow(2, card.wins - 1);
			}
		});

		sum = cards.reduce((acc, card) => acc + card.points, 0);
	}

	
</script>

<h1>Day 4</h1>
<!-- link to day/1/2 -->
<a href="/day/4/2">Part 2</a>

<h1>Input</h1>
<textarea bind:value={textData}></textarea>

{#if sum == 0}
	loading...
{:else}
	<h1>Result</h1>
	<p>{sum}</p>
{/if}



{#each cards as card}
	<div>
		<h2>Card {card.id}</h2>
		<p>My numbers: {card.myNumbers.join(', ')}</p>
		<p>Winning numbers: {card.winningNumbers.join(', ')}</p>
		<p>Points: {card.points}</p>
	</div>
{/each}
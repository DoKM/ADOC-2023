<script lang="ts">
	import { loadFile, delay } from '$lib/lib';
	import { onMount } from 'svelte';
	let originalData: string = '';
	onMount(async () => {
		originalData = await loadFile('data/day2.txt');
		data = originalData;
		run();
	});
	let maxRed = 12;
	let maxGreen = 13;
	let maxBlue = 14;
	let data = '';
	let textData = '';
	let dataArr: (string | game)[] = [];
	type round = {
		red: number;
		blue: number;
		green: number;
	};
	type game = {
		game: number;
		rounds: round[];
		possible: boolean;
		totalRed: number;
		totalBlue: number;
		totalGreen: number;
		power: number;
	};
	let sum = 0;
	async function run() {
		// split the data into an array on every new line
		dataArr = data.split('\n');

		let possibleGames: game[] = [];
		for (let i = 0; i < dataArr.length; i++) {
			if (i < 10) {
				let scale = 500 - i * 50;
				await delay(scale);
			}
			let currentLine = dataArr[i];
			if (typeof currentLine === 'string') {
				let gameNumber = (currentLine as string).match(/Game ([0-9]*):/);
				// remove the Game [0-9]*: from the string
				currentLine = (currentLine as string).replace(/Game [0-9]*:/, '');
				const rounds = (currentLine as string).split(';');
				let roundsArray: round[] = [];
				for (let j = 0; j < rounds.length; j++) {
					const round = rounds[j].split(',');
					if (round === null) continue;
					// console.log(round);
					let redValue = '0';
					let blueValue = '0';
					let greenValue = '0';
					for (let k = 0; k < round.length; k++) {
						const color = round[k].trim();
						if (color === '') continue;
						if (color === null) continue;
						if (color.includes('red')) {
							let redMatch = color.match(/[0-9]*/);
							if (redMatch === null) continue;
							redValue = redMatch[0];
						}
						if (color.includes('blue')) {
							let blueMatch = color.match(/[0-9]*/);
							if (blueMatch === null) continue;
							blueValue = blueMatch[0];
						}
						if (color.includes('green')) {
							let greenMatch = color.match(/[0-9]*/);
							if (greenMatch === null) continue;
							greenValue = greenMatch[0];
						}
					}
					const roundObject: round = {
						red: parseInt(redValue),
						blue: parseInt(blueValue),
						green: parseInt(greenValue)
					};
					roundsArray = [...roundsArray, roundObject];
				}
				if (gameNumber === null) gameNumber = ['0', '0'];

				let gameObject: game = {
					game: parseInt(gameNumber[1]),
					rounds: roundsArray,
					possible: true,
					totalRed: 0,
					totalBlue: 0,
					totalGreen: 0,
					power: 0
				};
				dataArr[i] = gameObject;
			}
		}
		for (let i = 0; i < dataArr.length; i++) {
			if (i < 10) {
				let scale = 500 - i * 50;
				await delay(scale);
			}
			if (typeof dataArr[i] === 'object') {
				let gameObject = dataArr[i] as game;
				for (let j = 0; j < gameObject.rounds.length; j++) {
					// if rounds[j].red is higher than totalRed set total to rounds[j].red
					if (gameObject.rounds[j].red > gameObject.totalRed) {
						gameObject.totalRed = gameObject.rounds[j].red;
					}
					if (gameObject.rounds[j].blue > gameObject.totalBlue) {
						gameObject.totalBlue = gameObject.rounds[j].blue;
					}
					if (gameObject.rounds[j].green > gameObject.totalGreen) {
						gameObject.totalGreen = gameObject.rounds[j].green;
					}
					// gameObject.totalRed += gameObject.rounds[j].red;
					// gameObject.totalBlue += gameObject.rounds[j].blue;
					// gameObject.totalGreen += gameObject.rounds[j].green;
				}
				if (gameObject.totalRed > maxRed) gameObject.possible = false;
				if (gameObject.totalBlue > maxBlue) gameObject.possible = false;
				if (gameObject.totalGreen > maxGreen) gameObject.possible = false;
				gameObject.power = gameObject.totalRed * gameObject.totalBlue * gameObject.totalGreen;
				dataArr[i] = gameObject;
			}
		}
		// sum the game value of all possible games
		for (let i = 0; i < dataArr.length; i++) {
			if (typeof dataArr[i] === 'object') sum += (dataArr[i] as game).power;
		}
	}
</script>

<h1>Day 2 part 2</h1>
<!-- link to day/1/2 -->

<h1>Input</h1>
<textarea bind:value={textData}></textarea>
<button
	on:click={() => {
		data = textData;
		run();
	}}>load TextArea</button
>
<button
	on:click={() => {
		data = originalData;
		run();
	}}>load original Data</button
>

<h2>Output</h2>
{#if sum == 0}
	<div>Loading...</div>
{:else}
	<p>Sum: {sum}</p>
{/if}
<!-- foreach on the dataArr -->

{#each dataArr as line}
	{#if typeof line === 'object'}
		<div style="color: hsl({line.game * 10}, 100%, 50%)">
			<h1>Game {line.game}</h1>
			<h2>Power {line.power}</h2>
			<!-- use details to hide some stuff -->
			<!-- if line.totalRed > maxRed color line red -->
			<!-- if line.totalBlue > maxBlue color line blue -->
			<!-- if line.totalGreen > maxGreen color line green -->
			<details>
				<summary>Minimum</summary>
				<p style={line.totalRed > maxRed ? 'color:red' : ''}>red: {line.totalRed}/12</p>
				<p style={line.totalGreen > maxGreen ? 'color:red' : ''}>green: {line.totalGreen}/13</p>
				<p style={line.totalBlue > maxBlue ? 'color:red' : ''}>blue: {line.totalBlue}/14</p>

				<details>
					<summary>Details</summary>

					{#each line.rounds as round, index}
						<h3>Round {index + 1}</h3>
						<p style={round.red > maxRed ? 'color:red' : ''}>red: {round.red}/12</p>
						<p style={round.green > maxGreen ? 'color:red' : ''}>green: {round.green}/13</p>
						<p style={round.blue > maxBlue ? 'color:red' : ''}>blue: {round.blue}/14</p>
					{/each}
				</details>
			</details>
		</div>
	{/if}
{/each}

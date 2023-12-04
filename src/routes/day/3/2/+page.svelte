<script lang="ts">
	import { loadFile, delay } from '$lib/lib';
	import { onMount } from 'svelte';
	let originalData: string = '';
	onMount(async () => {
		originalData = await loadFile('data/day3.txt');
		data = originalData;
		run();
	});
	let data = '';
	let textData = '';
	let dataArr: string[] = [];
	let displayData: string[] = [];
	let confirmedNumbers: number[] = [];
	let sum = 0;

	let symbols = ['*'];
	async function run() {
		confirmedNumbers = [];
		displayData = [];
		sum = 0;
		// split the data into an array on every new line
		dataArr = data.split('\n');
		for (let i = 0; i < dataArr.length; i++) {
			let line = dataArr[i];
			// match any character in the symbols array
			let regex = new RegExp(`[${symbols.join('')}]`, 'gi');
			let match;
			while ((match = regex.exec(line)) !== null) {
				let symbolIndex = match.index;
				// surround the symbol with a <span> tag with the color red

				let symbol = match[0];
				// replace the match with the span tag
				let multiply = false;
				if (symbol !== '*') {
					continue;
				}
				// get surrounding numbers
				let surroundingNumbers = getSurroundingNumbers(i, symbolIndex);

				if (surroundingNumbers.length >= 2) {
					let product = surroundingNumbers.reduce((a, b) => a * b);
					confirmedNumbers = [...confirmedNumbers, product];
				}
			}
			displayData = [...displayData, line];
		}
		sum = confirmedNumbers.reduce((a, b) => a + b);
	}

	function getSurroundingNumbers(lineIndex: number, symbolIndex: number): number[] {
		// check the line above
		let lineAbove = dataArr[lineIndex - 1];
		let numbersLine: number[] = [];
		if (lineAbove) {
			let numbersInLine = getNumbersFromLine(lineIndex - 1, symbolIndex, Direction.Up);
			numbersLine = [...numbersLine, ...numbersInLine];
		}
		// middle line
		{
			let numbersInLine = getNumbersFromLine(lineIndex, symbolIndex, Direction.Left);
			numbersLine = [...numbersLine, ...numbersInLine];
		}
		// check the line below
		let lineBelow = dataArr[lineIndex + 1];
		if (lineBelow) {
			let numbersInLine = getNumbersFromLine(lineIndex + 1, symbolIndex, Direction.Down);
			numbersLine = [...numbersLine, ...numbersInLine];
		}
		return numbersLine;
	}
	enum Direction {
		Up,
		Down,
		Left,
		Right
	}
	function getNumbersFromLine(
		lineNumber: number,
		symbolIndex: number,
		direction: Direction
	): number[] {
		let numbers = [];
		let line = dataArr[lineNumber];
		let index = symbolIndex;

		// get the character to the left of the symbol, same as symbol and right of symbol
		let leftCharacterIndex = index - 1;
		let rightCharacterIndex = index + 1;
		let characterArray = [line[leftCharacterIndex], line[index], line[rightCharacterIndex]];
		let leftSideArray: string[] = [];
		let rightSideArray: string[] = [];
		if (isNumber(characterArray[0])) {
			// check if the character before it is a number at the line
			let number = '';
			let numberIndex = leftCharacterIndex - 1;
			while (isNumber(line[numberIndex])) {
				number = line[numberIndex];
				leftSideArray = [number, ...leftSideArray];
				numberIndex--;
			}
		}

		if (isNumber(characterArray[2])) {
			// check if the character after it is a number at the line
			let number = '';
			let numberIndex = rightCharacterIndex + 1;
			while (isNumber(line[numberIndex])) {
				number = line[numberIndex];
				rightSideArray = [...rightSideArray, number];
				numberIndex++;
			}
		}
		let numbersInLine = [...leftSideArray, ...characterArray, ...rightSideArray];
		// split on any non number value such as a the values in symbols array and a .
		let numbersInLineSplit = numbersInLine.join('').split(/[^0-9]/gi);
		// remove all empty values
		numbersInLineSplit = numbersInLineSplit.filter((value) => value !== '');
		// console.log(numbersInLineSplit);
		return numbersInLineSplit.map((value) => parseInt(value));
	}

	function isNumber(char: string): boolean {
		if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(char)) {
			return true;
		}
		return false;
	}
</script>

<h1>Day 3</h1>
<!-- link to day/1/2 -->
<a href="/day/3/2">Part 2</a>

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
{#if sum == 0}
	loading...
{:else}
	<h1>Result</h1>
	<p>{sum}</p>
{/if}

<h2>Gears</h2>
{#each confirmedNumbers as number}
	<p>{number}</p>
{/each}

{#each displayData as line}
	{#if typeof line === 'string'}
		<p>{line}</p>
	{/if}
{/each}

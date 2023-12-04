<script lang="ts">
	import { loadFile, delay } from '$lib/lib';
	import { onMount } from 'svelte';
	let originalData: string = '';
	onMount(async () => {
		originalData = await loadFile('data/day3.txt');
		data = originalData;
		// function findUnique(str: string) {
		// 	// The variable that contains the unique values
		// 	let uniq = '';

		// 	for (let i = 0; i < str.length; i++) {
		// 		// Checking if the uniq contains the character
		// 		if (uniq.includes(str[i]) === false) {
		// 			// If the character not present in uniq
		// 			// Concatenate the character with uniq
		// 			uniq += str[i];
		// 		}
		// 	}
		// 	return uniq;
		// }
		// console.log(findUnique(data));
		run();
	});
	let data = '';
	let textData = '';
	let dataArr: string[] = [];
	let confirmedNumbers: number[] = [];
	let sum = 0;

	async function run() {
		// split the data into an array on every new line
		dataArr = data.split('\n');
		for (let i = 0; i < dataArr.length; i++) {
			let line = dataArr[i];
			// for loop over every character in the line
			for (let j = 0; j < line.length; j++) {
				let numberArray: string = '';
				let startNumber = j;
				while (isNumber(line[j])) {
					numberArray += line[j];
					j++;
				}
				if (numberArray.length == 0) {
					continue;
				}
				if (checkIfNumbersAreSurroundedBySymbol(i, startNumber, j)) {
					confirmedNumbers.push(parseInt(numberArray));
				}
			}
		}
		for (let i = 0; i < confirmedNumbers.length; i++) {
			sum += confirmedNumbers[i];
		}
	}

	function isNumber(character: string): boolean {
		if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(character)) {
			return true;
		}
		return false;
	}

	function checkIfNumbersAreSurroundedBySymbol(
		lineNumber: number,
		charterStartIndex: number,
		characterEndIndex: number
	) {
		// get the line above and below
		let lineAbove = dataArr[lineNumber - 1];
		let line = dataArr[lineNumber];
		let lineBelow = dataArr[lineNumber + 1];
		let numbersLength = characterEndIndex - charterStartIndex;
		let numbersLengthWithPadding = numbersLength + 2;
		let startIndexWithPadding = charterStartIndex - 1;
		// create an array of the numbers and padding
		// the first dimension of the array is the line
		// the second dimension is the character
		let numbersAndPadding: string[][] = [[], [], []];
		for (let i = 0; i < numbersLengthWithPadding; i++) {
			let lineAboveChar = ' ';
			if (lineAbove != undefined) {
				lineAboveChar = lineAbove[startIndexWithPadding + i];
			}
			let lineMiddleChar = line[startIndexWithPadding + i];

			let lineBelowChar = ' ';
			if (lineBelow != undefined) {
				lineBelowChar = lineBelow[startIndexWithPadding + i];
			}
			if (
				lineAboveChar == undefined ||
				lineAboveChar == ' ' ||
				lineAboveChar == '' ||
				lineAboveChar == '\n' ||
				lineAboveChar == '\r' ||
				lineAboveChar == '.'
			) {
				lineAboveChar = ' ';
			}
			if (
				lineMiddleChar == undefined ||
				lineMiddleChar == ' ' ||
				lineMiddleChar == '' ||
				lineMiddleChar == '\n' ||
				lineMiddleChar == '\r' ||
				lineMiddleChar == '.'
			) {
				lineMiddleChar = ' ';
			}
			if (
				lineBelowChar == undefined ||
				lineBelowChar == ' ' ||
				lineBelowChar == '' ||
				lineBelowChar == '\n' ||
				lineBelowChar == '\r' ||
				lineBelowChar == '.'
			) {
				lineBelowChar = ' ';
			}
			numbersAndPadding[0].push(lineAboveChar);
			numbersAndPadding[1].push(lineMiddleChar);
			numbersAndPadding[2].push(lineBelowChar);
		}
		// check if the numbers are surrounded by a symbol
		// list of characters which are considered symbols *&/@=+#$%-
		let symbols = ['*', '&', '/', '@', '=', '+', '#', '$', '%', '-'];
		let isSurroundedBySymbol = false;
		for (let i = 0; i < numbersAndPadding.length; i++) {
			let line = numbersAndPadding[i];
			for (let j = 0; j < line.length; j++) {
				let character = line[j];
				if (symbols.includes(character)) {
					isSurroundedBySymbol = true;
					return true;
				}
			}
		}
		return false;
	}
</script>

<h1>Day 3</h1>
<!-- link to day/1/2 -->
<a href="/day/3/2">Part 2</a>

<h1>Input</h1>
<textarea bind:value={textData}></textarea>

{#if sum == 0}
	loading...
{:else}
	<h1>Result</h1>
	<p>{sum}</p>
{/if}

{#each confirmedNumbers as number}
	<p>{number}</p>
{/each}

{#each dataArr as line}
	{#if typeof line === 'string'}
		<p>{line}</p>
	{/if}
{/each}

<script lang="ts">
	import { loadFile, delay } from '$lib/lib';
	import { onMount } from 'svelte';
	let originalData: string = '';
	onMount(async () => {
		originalData = await loadFile('data/day1-2.txt');
		data = originalData;
	});

	let textAreaData = '';
	let data = '';
	let dataArr: (string | string[])[] = [];
	let numberArray: number[] = [];
	let sum = 0;

	$: run(data);

	function extractNumbersAndStrings(inputString: string) {
		const numberWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

		const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

		let result: number[] = [];

		for (let i = 0; i < numberWords.length; i++) {
			const word = numberWords[i];
			const regex = new RegExp(word, 'gi');
			let match;
			while ((match = regex.exec(inputString)) !== null) {
				console.log(match.index, i + 1);
				result[match.index] = i + 1;
			}
		}

		// Extract string representations of numbers
		for (let i = 0; i < numbers.length; i++) {
			const word = numbers[i];
			const regex = new RegExp(word, 'gi');
			let match;
			while ((match = regex.exec(inputString)) !== null) {
				result[match.index] = i + 1; // Add numbers.length to avoid overlap
			}
		}

		//remove all undefined values from the array
		result = result.filter((value) => value !== undefined);
		console.log(result);
		return result;
	}

	// Example usage:

	async function run(textData: string) {
		numberArray = [];
		// split the data into an array on every new line
		dataArr = textData.split('\n');
		for (let i = 0; i < dataArr.length; i++) {
			if (typeof dataArr[i] === 'string') {
				// create a linear scaling value from 500 to 0 based on the index of the array
				if (i < 25) {
					let scale = 500 - (i / 25) * 500;
					await delay(scale);
				}

				// remove all non numbers from the string such as 1 2 3 but also one two three
				// replace the text version of a number with the number but do not go number by number do it all at once
				if (i == 945) {
					console.log(`dataArr[i]: ${i} =  ${dataArr[i]}`);
				}
				dataArr[i] = extractNumbersAndStrings(dataArr[i] as string).toString();
				// console.log(`dataArr[i]: ${i} =  ${dataArr[i]}`);
				dataArr[i] = (dataArr[i] as string).replace(/[^0-9]/g, '');

				let lineData = dataArr[i][0] + dataArr[i][dataArr[i].length - 1];
				dataArr[i] = lineData;
				if (i == 945) {
					console.log(`dataArr[i]: ${i} =  ${dataArr[i]}`);
				}
				// convert the lineData to a number
				numberArray[i] = parseInt(lineData);
			}
		}
		console.log(numberArray);

		// sum the numbers in the array
		sum = numberArray.reduce((a, b) => a + b, 0);
	}
</script>

<h1>Day 1 - Part 2</h1>

<textarea bind:value={textAreaData}></textarea>
<button
	on:click={() => {
		data = textAreaData;
	}}>load TextArea</button
>
<button
	on:click={() => {
		data = originalData;
	}}>load original Data</button
>

{#if sum == 0}
	<p>loading...</p>
{:else}
	<p>Sum: {sum}</p>
{/if}

{#each dataArr as line, index}
	<!-- random colour based on index -->
	<p style="color: hsl({index * 10}, 100%, 50%)">{line}</p>
{/each}

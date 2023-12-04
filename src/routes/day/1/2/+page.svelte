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
		const numberWords: { string: string; number: number }[] = [
			{ string: 'one', number: 1 },
			{ string: 'two', number: 2 },
			{ string: 'three', number: 3 },
			{ string: 'four', number: 4 },
			{ string: 'five', number: 5 },
			{ string: 'six', number: 6 },
			{ string: 'seven', number: 7 },
			{ string: 'eight', number: 8 },
			{ string: 'nine', number: 9 },
			{ string: '1', number: 1 },
			{ string: '2', number: 2 },
			{ string: '3', number: 3 },
			{ string: '4', number: 4 },
			{ string: '5', number: 5 },
			{ string: '6', number: 6 },
			{ string: '7', number: 7 },
			{ string: '8', number: 8 },
			{ string: '9', number: 9 }
		];

		let result: number[] = [];

		for (let i = 0; i < numberWords.length; i++) {
			const word = numberWords[i].string;
			const regex = new RegExp(word, 'gi');
			let match;
			while ((match = regex.exec(inputString)) !== null) {
				console.log(match.index, i + 1);
				result[match.index] = numberWords[i].number);
			}
		}

		// Extract string representations of numbers

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

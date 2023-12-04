<script lang="ts">
	import { loadFile, delay } from '$lib/lib';
	import { onMount } from 'svelte';
	let originalData: string = '';
	onMount(async () => {
		originalData = await loadFile('data/day1.txt');
		data = originalData;
		run();
	});

	let textAreaData = '';
	let data = '';
	let dataArr: (string | string[])[] = [];
	let numberArray: number[] = [];
	let sum = 0;
	async function run() {
		// split the data into an array on every new line
		dataArr = data.split('\n');
		for (let i = 0; i < dataArr.length; i++) {
			if (typeof dataArr[i] === 'string') {
				dataArr[i] = (dataArr[i] as string).replace(/[^0-9]/g, '');
				let lineData = dataArr[i][0] + dataArr[i][dataArr[i].length - 1];
				dataArr[i] = lineData;
				// convert the lineData to a number
				numberArray.push(parseInt(lineData));
			}
			await delay(500);
		}

		// sum the numbers in the array
		sum = numberArray.reduce((a, b) => a + b, 0);
	}
</script>

<h1>Day 1</h1>
<!-- link to day/1/2 -->
<a href="/day/1/2">Part 2</a>

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

{#each dataArr as line}
	<p>{line}</p>
{/each}

<script lang="ts">
	import { loadFile, delay } from '$lib/lib';
	import { onMount } from 'svelte';
	let originalData: string = '';
	onMount(async () => {
		originalData = await loadFile('data/day6.txt');
		data = originalData;

		run();
	});
	let data = '';
	let textData = '';
	let dataArr: string[] = [];
	type Race = {
		time: number;
		distance: number;
		possibleWinningTimes: number;
	};

	type Racer = {
		speed: number;
		time: number;
	};
	let output: number = 0;

	let raceInfo: Race[] = [];

	async function run() {
		// split the data into an array on every new line
		dataArr = data.split('\n');
		let regex = /([0-9]+)/;
		let match;
		let i = 0;
		while ((match = regex.exec(dataArr[0]))) {
			raceInfo.push({
				time: parseInt(match[1]),
				distance: 0,
				possibleWinningTimes: 0
			});
			// replace
			dataArr[0] = dataArr[0].replace(match[0], '');
			i++;
		}
		i = 0;
		while ((match = regex.exec(dataArr[1]))) {
			raceInfo[i].distance = parseInt(match[1]);
			dataArr[1] = dataArr[1].replace(match[0], '');
			i++;
		}
		for (let i = 0; i < raceInfo.length; i++) {
			let race = raceInfo[i];
			let lastDistance = 0;
			for (let accelerationTime = 1; accelerationTime < race.time; accelerationTime++) {
				let speed = accelerationTime;
				let timeLeft = race.time - accelerationTime;
				let distance = speed * timeLeft;
				let raceDistance = race.distance;
				console.log({
					speed,
					timeLeft,
					distance,
					raceDistance,
					possible: distance > race.distance
				});
				if (distance > race.distance) {
					race.possibleWinningTimes = race.possibleWinningTimes + 1;
					lastDistance = distance;
				}
				if (distance < lastDistance) {
					break;
				}
			}
			raceInfo[i] = race;
		}
		for (let i = 0; i < raceInfo.length; i++) {
			console.log(raceInfo[i].possibleWinningTimes);
			if (output == 0) {
				output = raceInfo[i].possibleWinningTimes;
			} else {
				output = output * raceInfo[i].possibleWinningTimes;
			}
		}
		console.log(raceInfo);
	}
</script>

<h1>Day 6</h1>
<!-- link to day/1/2 -->
<a href="/day/6/2">Part 2</a>

<h1>Input</h1>
<textarea bind:value={textData}></textarea>

{#if output}
	<h1>Output</h1>
	<p>{output}</p>
{/if}

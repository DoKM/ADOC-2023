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
		lowestWiningTime: number;
		highestWinningTime: number;
		totalWinningTimes: number;
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
		let tempRaces = [];
		while ((match = regex.exec(dataArr[0]))) {
			tempRaces.push({
				time: parseInt(match[1]),
				distance: 0,
				lowestWiningTime: 0,
				highestWinningTime: 0,
				totalWinningTimes: 0
			});
			// replace
			dataArr[0] = dataArr[0].replace(match[0], '');
			i++;
		}
		i = 0;
		while ((match = regex.exec(dataArr[1]))) {
			tempRaces[i].distance = parseInt(match[1]);
			dataArr[1] = dataArr[1].replace(match[0], '');
			i++;
		}

		let tempRace = {
			time: 0,
			distance: 0,
			lowestWiningTime: 0,
			highestWinningTime: 0,
			totalWinningTimes: 0
		};

		for (let i = 0; i < tempRaces.length; i++) {
			let race = tempRaces[i];
			if (tempRace.time == 0) {
				tempRace.time = race.time;
			} else {
				let time = parseInt(`${tempRace.time}${race.time}`);
				tempRace.time = time;
			}
			if (tempRace.distance == 0) {
				tempRace.distance = race.distance;
			} else {
				let distance = parseInt(`${tempRace.distance}${race.distance}`);
				tempRace.distance = distance;
			}
		}
		raceInfo.push(tempRace);

		for (let i = 0; i < raceInfo.length; i++) {
			let race = raceInfo[i];
			let lastDistance = 0;
			for (let accelerationTime = 1; accelerationTime < race.time; accelerationTime++) {
				let speed = accelerationTime;
				let timeLeft = race.time - accelerationTime;
				let distance = speed * timeLeft;
				let raceDistance = race.distance;

				if (distance > race.distance) {
					if (race.lowestWiningTime == 0) {
						race.lowestWiningTime = accelerationTime;
					}
					if (race.highestWinningTime < accelerationTime) {
						race.highestWinningTime = accelerationTime;
					}
				}
				if (distance < lastDistance) {
					break;
				}
			}
			raceInfo[i] = race;
		}
		for (let i = 0; i < raceInfo.length; i++) {
			let race = raceInfo[i];
			race.totalWinningTimes = race.highestWinningTime - race.lowestWiningTime + 1;
			output = race.totalWinningTimes;
		}
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

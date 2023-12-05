<script lang="ts">
	import { loadFile, delay } from '$lib/lib';
	import { onMount } from 'svelte';
	let originalData: string = '';
	onMount(async () => {
		originalData = await loadFile('data/day5.txt');
		data = originalData;

		run();
	});
	let data = '';
	let textData = '';
	let dataArr: string[] = [];

	let sum = 0;

	let locationMap: LocationMap[] = [];
	let seeds: SeedRange[] = [];

	type LocationMap = {
		name: string;
		locations: SDRange[];
	};

	type SDRange = {
		source: number;
		destination: number;
		range: number;
	};

	let endingLocations: number[] = [];
	let originEndLocation: {
		origin: number;
		ending: number;
		history: number[];
	}[] = [];

	type SeedRange = {
		seed: number;
		range: number;
	};

	let lowest: { source: number; destination: number; history: number[] } = {
		source: 0,
		destination: 0,
		history: []
	};

	async function run() {
		// split the data into an array on every new line
		dataArr = data.split('\n');
		seeds = getSeeds(dataArr[0]);
		console.log(seeds);
		for (let i = 1; i < dataArr.length; i++) {
			let line = dataArr[i];
			if (line === '') {
				continue;
			}
			let location = getDataMap(i);
			if (location) {
				console.log(location);
				console.log(locationMap);
				locationMap = [...locationMap, location];
			}
		}
		let foundLowest = false;
		let i = 0;
		while (foundLowest === false) {
			// loop through locationMap backwards
			let seed = i;
			let history = [i];
			for (
				let locationMapIndex = locationMap.length - 1;
				locationMapIndex >= 0;
				locationMapIndex--
			) {
				let map = locationMap[locationMapIndex];
				seed = getLocationFromMap(seed, map);
				history = [seed, ...history];
			}
			if (checkIfSeedWithinSeedRange(seed)) {
				lowest = {
					source: i,
					destination: seed,
					history: history
				};
				foundLowest = true;
			}
			i++;
		}

		// for (let seedIndex = 0; seedIndex < seeds.length; seedIndex++) {
		// 	const seed = seeds[seedIndex];
		// 	let currentSeed = seed;
		// 	let history: number[] = [];
		// 	for (let locationMapIndex = 0; locationMapIndex < locationMap.length; locationMapIndex++) {
		// 		let map = locationMap[locationMapIndex];
		// 		currentSeed = getLocationFromMap(currentSeed, map);
		// 		history = [...history, currentSeed];
		// 	}
		// 	originEndLocation = [
		// 		...originEndLocation,
		// 		{ origin: seed, ending: currentSeed, history: history }
		// 	];
		// 	endingLocations.push(currentSeed);
		// }

		// get the lowest value in endingLocations
	}

	function getSeeds(line: string): SeedRange[] {
		// line = // regex for line 1
		// seeds: 3136945476 509728956 1904897211 495273540 1186343315 66026055 1381149926 11379441 4060485949 190301545 444541979 351779229 1076140984 104902451 264807001 60556152 3676523418 44140882 3895155702 111080695
		let regex = /(([0-9]+)\s([0-9]+))/;
		let match;
		let combinedSeeds: SeedRange[] = [];
		while ((match = regex.exec(line)) != null) {
			line = line.replace(match[1], '');
			line = line.trim();
			combinedSeeds.push({
				seed: parseInt(match[2]),
				range: parseInt(match[3])
			});
		}

		// take the seeds array and combine every two numbers into a single array with both numbers

		return combinedSeeds;
	}

	function getDataMap(index: number): LocationMap | undefined {
		let line = dataArr[index];
		// soil-to-fertilizer map:
		const regex = /(.+) map:/;
		let match = regex.exec(line);
		if (match == null) {
			return;
		}
		const name = match[1];
		let locations: SDRange[] = [];
		for (let i = index + 1; i < dataArr.length; i++) {
			let line = dataArr[i];
			if (line === '') {
				break;
			}
			let sdRange = getSourceDestinationRange(line);
			if (sdRange) {
				locations.push(sdRange);
			} else {
				break;
			}
		}
		// sort locations by source
		// locations.sort((a, b) => a.source - b.source);
		return {
			name,
			locations
		};
	}

	function getSourceDestinationRange(line: string): SDRange | undefined {
		// 2639375948 1113622284 12767015
		let regex = /(\d+) (\d+) (\d+)/;
		let match = regex.exec(line);
		if (match) {
			return {
				source: parseInt(match[2]),
				destination: parseInt(match[1]),
				range: parseInt(match[3])
			};
		}
	}

	function getLocationFromMap(location: number, locationMap: LocationMap): number {
		let locations = locationMap.locations;
		for (let i = 0; i < locations.length; i++) {
			let sdRange = locations[i];
			if (location >= sdRange.destination && location <= sdRange.destination + sdRange.range) {
				let offset = location - sdRange.destination;
				return sdRange.source + offset;
			}
		}
		return location;
	}

	function checkIfSeedWithinSeedRange(seed: number): boolean {
		for (let i = 0; i < seeds.length; i++) {
			let seedRange = seeds[i];
			if (seed >= seedRange.seed && seed <= seedRange.seed + seedRange.range) {
				return true;
			}
		}
		return false;
	}
</script>

<h1>Day 5 - part 2</h1>
<!-- link to day/1/2 -->
<!-- <a href="/day/5/2">Part 2</a> -->

<h1>Input</h1>
<textarea bind:value={textData}></textarea>

<h1>Output</h1>
<h2>{lowest.source}->{lowest.destination}</h2>
<div>
	{#each lowest.history as history}
		<p>{history}</p>
	{/each}
</div>
<h2>seeds</h2>
{#each seeds as seed}
	<p>{seed.seed} -> {seed.seed + seed.range}</p>
{/each}
<h2>location map</h2>

{#each locationMap as location}
	<h2>{location.name}</h2>
	{#each location.locations as sdRange}
		<p>{sdRange.source} -> {sdRange.destination} ({sdRange.range})</p>
	{/each}
{/each}

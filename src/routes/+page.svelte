<script lang="ts">
	// get the current day from the dateetime
	let date = new Date();
	// if the current day is less than december 1st 2023, then the max day is 0;
	// if the current day is more than december 25th 2023, then the max day is 25;
	// otherwise the max day is the current day
	let maxDays =
		date.getMonth() == 11 && date.getDate() > 25 ? 25 : date.getDate() < 1 ? 0 : date.getDate();

	let days: number[] = [];
	for (let i = 1; i <= maxDays; i++) {
		days.push(i);
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<!-- create a for loop which creates a <a> link to /day/{index}, there should be a max value -->
{#each days as day}
	<a href="/day/{day}">Day {day}</a>
{/each}

<script lang="ts">
	const maxDays: number = 1;

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


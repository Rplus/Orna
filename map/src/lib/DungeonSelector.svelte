<script>
	import { DungeonTypes, imgPathToName } from './u.js';
	export let type = '';
</script>

<select bind:value={type}>
	<option value="">?</option>
	{#each DungeonTypes as dungeonType}
		<option value={dungeonType[0]}>
			{dungeonType[1]} {imgPathToName(dungeonType[0])}
		</option>
	{/each}

	<optgroup label="-----------------------">
		<option value="⚠️remove">⚠️ Remove 刪除地城 ⚠️</option>
	</optgroup>
</select>

<style>
	select {
		text-transform: capitalize;
	}
</style>

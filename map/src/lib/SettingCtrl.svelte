<script>
	import { ioHQ, dungeonIconStyle, } from '../stores.js';

	import {
		getDungeonImageUrl,
		reset,
		// imgPathToName,
		// getDungeonTypeName,
		// postData,
	} from './u.js';
	import Dialog from './Dialog.svelte';
</script>


{#if $ioHQ.openedPanel === 'settings'}
<Dialog>
	<h3>
		Settings
	</h3>

	<ul>
		<li class="mb-2">
			<h4>Dungeon Icon Style:</h4>
			<label class="flex">
				Background color:
				<input type="color" bind:value={$dungeonIconStyle.bgc}>
				<input type="text" bind:value={$dungeonIconStyle.bgc} size="1">
			</label>
			<label class="flex">
				Transparency:
				<input type="range" bind:value={$dungeonIconStyle.bgcAlpha} min="0" max="1" step="0.1">
				<input type="number" bind:value={$dungeonIconStyle.bgcAlpha} min="0" max="1" step="0.1">
			</label>
		</li>

		<li class="mb-2">
			<h4>Default view distance</h4>
			<input type="number" bind:value={$ioHQ.vd} min="0" max="1500" step="1">
		</li>

		<li class="mb-2">
			<h4>Custom map filter:</h4>
			<label class="flex">
				<input type="checkbox" bind:checked={$ioHQ.filters.checked}>
				Show buildings that admin reviewed only.
			</label>

			<!--
			<label class="flex">
				<input type="checkbox" bind:checked={$ioHQ.filters.titanOnly}>
				Show titan buildings only.
			</label>
			-->

			<label class="flex">
				<input type="checkbox" bind:checked={$ioHQ.filters.hideRemoved}>
				Hide buildings that be marked as 'removed'.
			</label>

		</li>

		<li class="mb-2">
			<h4>Info</h4>
			<div>Made by <a href="">Rplus</a>.🥂</div>
		</li>
	</ul>

	<hr>
	<button class="danger" on:click={reset}>RESET Config</button>
	<hr>

</Dialog>
{/if}


<style>
h4 {
	margin-top: 0.5em;
	margin-bottom: 0.5em;
}

</style>

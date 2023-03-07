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
		<li>
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

		<li>
			<h4>Info</h4>
			<div>asd</div>
		</li>
	</ul>

	<hr>
	<button class="danger" on:click={reset}>RESET</button>
	<hr>

</Dialog>
{/if}

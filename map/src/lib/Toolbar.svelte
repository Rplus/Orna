<script>
  import {getContext} from 'svelte';
	import LocateCtrl from './LocateCtrl.svelte';
	import ToggleButton from './ToggleButton.svelte';
	import { ioHQ } from '../stores.js';

	let active = !false;

	function togglePanel(type = '') {
		$ioHQ.openedPanel = ($ioHQ.openedPanel === type) ? '' : type;
	}

</script>


<div class="toolbar" on:dblclick|stopPropagation>
	<div hidden={!active} class="toolbar-menu">
		<LocateCtrl />
		<br><br>
		<button
			class="btn-with-icon leaflet-bar"
			on:click={() => togglePanel('dungeon')}
		>🏠</button>

		<button
			class="btn-with-icon leaflet-bar"
			on:click={() => togglePanel('alt')}
		>📍</button>

		<button
			class="btn-with-icon leaflet-bar"
			on:click={() => togglePanel('settings')}
		>⚙️</button>
		<br><br>
	</div>
	<ToggleButton bind:active={active} icons={['✕', '☰']} />
</div>


<style>
.toolbar {
	font-size: 1.15rem;
}
.toolbar-menu:not([hidden]) {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	width: min-content;
}
</style>


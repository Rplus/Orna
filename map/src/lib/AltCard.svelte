<script>
	export let meta = { color: '#ff0000' };
	import LatLng from './LatLng.svelte';
	import { map } from '../stores.js';

	$: _map = $map && $map.getMap && $map.getMap();

	function focus() {
		_map?.flyTo(meta.latLng);
	}

</script>


{#if meta.latLng}
<fieldset>
	<legend><button on:click={focus}>⚓</button></legend>

	<label class="flex">
		Name:
		<input type="text" bind:value={meta.label} readonly />
	</label>

	<label class="flex">
		VD:
		<input type="number" bind:value={meta.vd} readonly />
	</label>

	<details>
		<summary>Position:</summary>
		<div>
			<LatLng latLng={meta.latLng} readonly />
		</div>
	</details>
</fieldset>
{/if}


<style>
	fieldset {
		margin-top: 1em;
	}
</style>

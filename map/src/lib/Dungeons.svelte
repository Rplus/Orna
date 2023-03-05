<script>
	import { createEventDispatcher } from 'svelte';

	// const dataUrl = 'https://opensheet.elk.sh/1u89k2oUXRFOLIqVCm6bGXD-2pugwj7RIhM1qBKbT9Zg/data';
	// import dataUrl from '../marker.geojson?url';
	import dataUrl from '../fake.data.geo.json?url';


	import { ioHQ, dungeonVisibility, map } from '../stores.js';
	import Dialog from './Dialog.svelte';
	import DungeonMarker from './DungeonMarker.svelte';

	import {
		getDungeonImageUrl,
		imgPathToName,
		getDungeonTypeName,
	} from './u.js';

	$: _map = $map && $map.getMap && $map.getMap();

	let markers = [];

	fetch(dataUrl).then(r => r.json()).then(data => {
		markers = data.map(i => {
			return {
				...i,
				// index: i.index || +new Date(),
				_latLng: L.GeoJSON.coordsToLatLng([i.lng, i.lat]),
			}
		});
		checkMarkersInView();
		_map.on('moveend', checkMarkersInView);
	});

	function checkMarkersInView() {
		if (!_map) {
			console.warn('map NG');
			return;
		}
		let mapBounds = _map.getBounds();
		markers = markers.map(m => {
			return {
				...m,
				_inview: mapBounds.contains(m._latLng),
			};
		});
	}

	// let editable = false;
	// function handlePopupClose(argument) {
	// 	editable = false;
	// }


	// const dispatch = createEventDispatcher();
	// function renewMarker(markerIndex) {
	// 	dispatch('render', markers[markerIndex].geometry.latLng);
	// }

	function createBuilding() {
	}

	let dungeonVisibilityStyle = '';
	$: {
		let selectors = $dungeonVisibility
			.filter(i => i.visible)
			.map(i => `.dungeon-icon.dungeon-icon.dungeon-icon--${i.id}`).join();
		dungeonVisibilityStyle = selectors ? `<style>${selectors}{display:unset;}</style>` : '';
	}

</script>

<svelte:head>
	{@html dungeonVisibilityStyle}
</svelte:head>

{#each markers as marker (marker.index) }
	{#if marker._inview}
		<DungeonMarker bind:marker={marker} />
	{/if}
{/each}

<!-- DungeonCtrl panel -->
{#if $ioHQ.openedPanel === 'dungeon'}

<Dialog>
	<h3>
		<button on:click={createBuilding}>+</button>
		Dungeons
	</h3>

	<div>
		<div style="font-size: 2rem; text-align: center">🙊 🙈 🙉</div>
		<div class="buildings-ctrl">
			{#each $dungeonVisibility as dv}
				<label class="buildings-ctrl-label">
					<span class="buildings-ctrl-title">
						<input class="buildings-ctrl-checkbox" type="checkbox" bind:checked={dv.visible}>
						<div class="buildings-ctrl-bgc" />
						{dv.name}
					</span>
					<br>
					<img
						alt="dungeon image: {dv.name}"
						src={getDungeonImageUrl(dv.img)}
						style="image-rendering: pixelated; margin-left: 1.25em;"
						width="64"
						height="64"
					/>
				</label>
			{/each}
		</div>
	</div>

</Dialog>

{/if}


<style>
:global(.dungeon-icon.dungeon-icon) {
	display: none;
	image-rendering: pixelated;
}
.buildings-ctrl-label {
	position: relative;
	display: block;
	border: 1px dashed #0003;
	padding: 0.5em;
	list-style: none;
	cursor: pointer;
	overflow: hidden;
}
.buildings-ctrl-checkbox ~ .buildings-ctrl-bgc {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: -1;
	background-color: #00f2;
	visibility: hidden;
}
.buildings-ctrl-checkbox:checked ~ .buildings-ctrl-bgc {
	visibility: visible;
}

.buildings-ctrl {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: .5em;
}
.buildings-ctrl-title {
	display: inline-flex;
	align-items: center;
	gap: .25em;
}
</style>

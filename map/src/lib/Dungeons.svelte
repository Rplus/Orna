<script>
	import { createEventDispatcher } from 'svelte';

	import {
		Popup,
		Marker,
		Icon,
		DivIcon,
		Tooltip,
	} from 'svelte-leafletjs';

	// const dataUrl = 'https://opensheet.elk.sh/1u89k2oUXRFOLIqVCm6bGXD-2pugwj7RIhM1qBKbT9Zg/data';
	// import dataUrl from '../marker.geojson?url';
	import dataUrl from '../fake.data.geo.json?url';

	import DungeonSelector from './DungeonSelector.svelte';
	import LatLngInput from './LatLng.svelte';

	import { ioHQ, dungeonVisibility, map } from '../stores.js';
	import Dialog from './Dialog.svelte';

	import {
		getDungeonImageUrl,
		imgPathToName,
		getDungeonTypeName,
	} from './u.js';

	$: _map = $map && $map.getMap && $map.getMap();

	let markers = [];
	fetch(dataUrl).then(r => r.json()).then(d => {
		markers = d.features.map(f => {
			f.geometry.latLng = L.GeoJSON.coordsToLatLng(f.geometry.coordinates);
			if (!f.properties.type) {
				f.properties.type = ''
			}
			return f;
		});
		checkMarkersInView();
		_map.on('moveend', checkMarkersInView);
	});

	function checkMarkersInView() {
		if (!_map) { return; }
		let mapBounds = _map.getBounds();
		markers = markers.map(m => {
			return {
				...m,
				inview: mapBounds.contains(m.geometry.latLng),
			};
		});
	}

	let editable = false;
	function handlePopupClose(argument) {
		editable = false;
	}


	const dispatch = createEventDispatcher();
	function renewMarker(markerIndex) {
		dispatch('render', markers[markerIndex].geometry.latLng);
	}


	let iconCache = {};
	function getMarkerIcon(type) {
		if (!iconCache[type]) {
			let size = 36 * 1.25;
			iconCache[type] = L.icon({
				iconUrl: getDungeonImageUrl(type),
				iconSize: [size, size],
				iconAnchor: [size / 2, size],
				popupAnchor: [0, -size],
				tooltipAnchor: [0, 2],
				className: `dungeon-icon dungeon-icon--${imgPathToName(type) || 'unknown'}`,
			});
		};
		return iconCache[type];
	}

	function createBuilding() {
	}


	let tooltipOptions = {
		direction: 'bottom',
	};


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

{#each markers as marker, index}
	<Marker
		latLng={marker.geometry.latLng}
		icon={getMarkerIcon(marker.properties.type)}
		events={['popupclose']}
		on:popupclose={handlePopupClose}
	>
		{#if marker.properties.type}
			<Tooltip options={tooltipOptions}>
				{getDungeonTypeName(marker.properties.type)}
			</Tooltip>
		{/if}

		<Popup>
			<fieldset disabled={!editable}>
				<legend>
					ℹ️ Info
					{#if marker.properties.timestamp}
						<span class="timestamp">
							⌚: {new Date(marker.properties.timestamp).toJSON()}
						</span>
					{/if}
				</legend>

				<img
					class="dungeon-img"
					alt="dungeon image"
					src={getDungeonImageUrl(marker.properties.type)}
					width="128"
				/>

				<label class="flex">
					Type:
					<DungeonSelector bind:type={marker.properties.type} />
				</label>

				<label class="flex">
					Name:
					<input type="text" bind:value={marker.properties.name}>
				</label>

				<details>
					<summary>Position:</summary>
					<div>
						<LatLngInput latLng={marker.geometry.latLng} />
					</div>
				</details>
			</fieldset>

			<hr>

			<div class="action-btns-box">
				<label class="flex">
					<input type="checkbox" bind:checked={editable}>
					<span>
					Edit
					</span>
				</label>


				<div>
					<button
						disabled={!editable}
					>
						⇧ Upload
					</button>
					<button
						on:click={() => renewMarker(index)}
						disabled={!editable}
					>
						<!-- 🗘  -->
						Check
					</button>
				</div>
			</div>
		</Popup>

	</Marker>
{/each}


<!-- <DungeonCtrl /> -->
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
.timestamp {
	font-family: monospace;
	font-size: small;
	opacity: 0.5;
}

.dungeon-img {
	display: block;
	margin: auto;
	image-rendering: pixelated;
}
</style>

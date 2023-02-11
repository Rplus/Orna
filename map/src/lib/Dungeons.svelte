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

	import { getDungeonImageUrl } from './u.js';



	let markers = [];
	fetch(dataUrl).then(r => r.json()).then(d => {
		markers = d.features.map(f => {
			f.geometry.latLng = L.GeoJSON.coordsToLatLng(f.geometry.coordinates);
			if (!f.properties.type) {
				f.properties.type = ''
			}
			return f;
		});
	});


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
				className: `dungeon-icon dungeon-icon--${type}`,
			});
		};
		return iconCache[type];
	}


	let tooltipOptions = {
		direction: 'bottom',
	};
</script>

{#each markers as marker, index}
	<Marker
		latLng={marker.geometry.latLng}
		icon={getMarkerIcon(marker.properties.type)}
		events={['popupclose']}
		on:popupclose={handlePopupClose}
	>
		{#if marker.properties.type}
			<Tooltip options={tooltipOptions}>
				{marker.properties.type}
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
						🗘 Check
					</button>
				</div>
			</div>
		</Popup>

	</Marker>
{/each}


<style>
.timestamp {
	font-family: monospace;
	font-size: small;
	opacity: 0.5;
}

.dungeon-img {
	display: block;
	margin: auto;
}
</style>

<script>
	import * as lodash from 'lodash-es';
	import {
		Circle,
		Popup,
		Marker,
		Icon,
		DivIcon,
		Tooltip,
	} from 'svelte-leafletjs';
	import LatLngInput from './LatLng.svelte';
	import AltCard from './AltCard.svelte';
	import Dialog from './Dialog.svelte';
	import { getItem, saveItem, } from './u.js';
	import {
		// alts,
		ioHQ,
		map
	} from '../stores.js';

	let saved_alts = getSavedAlts();
	let alts = getSavedAlts();

	$: _map = $map && $map.getMap && $map.getMap();

	$: {
		alts;
		saved_alts;
		checkDataChanged();
	}


	let altProperties = [
		// 'color',
		'label',
		'latLng',
		'vd',
	];

	let altsTempForDragging = [];

	let altIcon = L.divIcon({
		iconSize: [0, 0],
		popupAnchor: [0, -36],
		html: '<div class="alt-icon" />',
	});

	function toggleDragging(markerIndex) {
		let marker = alts[markerIndex].marker.getMarker();
		if (marker.dragging._enabled) {
			marker.dragging.disable();
		} else {
			marker.dragging.enable();
		}
	}

	function dragMarker(markerIndex, e) {
		let marker = alts[markerIndex].marker.getMarker();
		altsTempForDragging[markerIndex].latLng = e.detail.target._latlng;
	}

	function _handle_dragend(markerIndex, e) {
		let marker = alts[markerIndex].marker.getMarker();
		alts[markerIndex].latLng = e.detail.target._latlng;
		marker.dragging.disable();
		altsTempForDragging = [];
		console.log('dragend', {alts});
	}

	function enableMarkerDraggable(markerIndex) {
		let marker = alts[markerIndex].marker.getMarker();
		marker.dragging.enable();
		altsTempForDragging[markerIndex] = {};
	}

	function checkDataChanged() {
		for (var i = alts.length - 1; i >= 0; i--) {
			let altData = pickAltData(alts[i]);
			alts[i].changed = !lodash.isEqual(saved_alts[i], altData);
		}
	}

	function saveAlts() {
		let newAlts = alts.filter(alt => alt && !alt.delete).map(pickAltData);
		console.log({newAlts});
		saveItem('alts', newAlts);
		alts = getSavedAlts();
		saved_alts = getSavedAlts();
	}

	function pickAltData(altData) {
		return lodash.pick(altData, altProperties);
	}

	function getSavedAlts() {
		return getItem('alts') || [];
	}

	function createNewAlt(latLng = _map.getCenter()) {
		return {
		  label: `alt-${+new Date()}`,
		  latLng: {
		    lat: latLng.lat,
		    lng: latLng.lng,
		  },
		  vd: 500
		}
	}

	function deleteAlt(index) {
		let _confirm = window.confirm(`⚠️ Are you sure to delete ${alts[index]?.label}?`);
		if (_confirm) {
			alts[index].delete = true;
			console.log('delete', index, alts);
			saveAlts();
		}
	}

	function add() {
		alts = alts.concat(createNewAlt());
	}
</script>


{#if !$ioHQ.hideAltMarkers}
	{#each alts as alt, index}
		<Circle
			color="#99333399"
			fillColor="#ff0099"
			latLng={altsTempForDragging[index]?.latLng || alt.latLng}
			radius={alt.vd}
		/>

		<Marker
			bind:this={alt.marker}
			latLng={alt.latLng}
			events={['drag', 'dragend']}
			on:drag={(e) => dragMarker(index, e)}
			on:dragend={(e) => _handle_dragend(index, e)}
		>
			{#if alt.label}
				<Tooltip>{alt.label}</Tooltip>
			{/if}

			<Popup>
				<fieldset>
					<legend>
						ℹ️ Info
					</legend>
				<div>
					<label class="flex">
						Name:
						<input type="text" bind:value={alt.label} />
					</label>

					<label class="flex">
						VD:
						<input type="number" bind:value={alt.vd} />
					</label>

					<details>
						<summary>Position:</summary>
						<div>
							<LatLngInput latLng={alt.latLng} readonly />
						</div>

						<button on:click={() => deleteAlt(index)} style="color:red; font-weight:900;">
							❌ DELETE
						</button>

					</details>
				</div>
				</fieldset>

				<hr>

				<div class="action-btns-box">
					<button on:click={() => enableMarkerDraggable(index)}>
						📌 Drag
					</button>

					<button
						disabled={!alt.changed}
						on:click={() => saveAlts(index)}
					>
						💾 Save All Portals
					</button>
				</div>

			</Popup>
		</Marker>
	{/each}
{/if}



{#if $ioHQ.openedPanel === 'alt'}
	<Dialog>
		<h3>
			<button on:click={add}>+</button>
			Portals
		</h3>

		<label class="flex">
			<input type="checkbox" bind:checked={$ioHQ.hideAltMarkers} />
			hide portal markers
		</label>

		{#each alts as alt, index}
			<AltCard meta={alt} />
		{/each}
	</Dialog>
{/if}

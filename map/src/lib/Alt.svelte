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
	import { ioHQ } from '../stores.js';

	let ori_alts = getSavedAlts();
	let alts = getSavedAlts();

	$: {
		alts;
		ori_alts;
		checkDataChanged()
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
		console.log('checkDataChanged');
		for (var i = alts.length - 1; i >= 0; i--) {
			let altData = pickAltData(alts[i]);
			alts[i].changed = !lodash.isEqual(ori_alts[i], altData);
		}
	}

	function saveAlt(markerIndex) {
		ori_alts[markerIndex] = pickAltData(alts[markerIndex]);
		saveItem('alts', ori_alts);
	}

	function pickAltData(altData) {
		return lodash.pick(altData, altProperties);
	}

	function getSavedAlts() {
		return getItem('alts') || [];
	}

	function add() {
		console.log('aaadd');
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
					</details>
				</div>
				</fieldset>

				<hr>

				<div class="action-btns-box">

					<button on:click={() => enableMarkerDraggable(index)}>
						📌 Enable Draggable
					</button>

					<button
						disabled={!alt.changed}
						on:click={() => saveAlt(index)}
					>
						💾 Save
					</button>
				</div>

			</Popup>
		</Marker>
	{/each}
{/if}



{#if $ioHQ.altDialog}
	<Dialog>
		<h3>Portals</h3>

		<label class="flex">
			<input type="checkbox" bind:checked={$ioHQ.hideAltMarkers} />
			hide portal markers
		</label>

		<hr>
		<button on:click={add}>+</button>

		{#each alts as alt, index}
			<AltCard meta={alt} />
		{/each}
	</Dialog>
{/if}

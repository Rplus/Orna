<script>
	export let marker = {};
	import { createEventDispatcher } from 'svelte';
	import {
		Popup,
		Marker,
		Icon,
		Tooltip,
	} from 'svelte-leafletjs';

	import {
		getMarkerIcon,
		getDungeonImageUrl,
		imgPathToName,
		getDungeonTypeName,
	} from './u.js';

	import LatLngInput from './LatLng.svelte';
	import DungeonSelector from './DungeonSelector.svelte';

	// const dispatch = createEventDispatcher();
	// function renewMarker(markerIndex) {
	// 	dispatch('render', markers[markerIndex].geometry.latLng);
	// }

	let editable = false;
	let draggable = false;
	function _handle_popupclose(argument) {
		editable = false;
	}

	console.log(55 ,marker.type);

	$: {
		// console.log(223, marker);
	}

	$: {
		if (marker._node?.getMarker) {
			let _m = marker._node?.getMarker();
			if (draggable) {
				_m.dragging.enable();
			} else {
				_m.dragging.disable();
			}
		}
	}


	function _handle_dragend(e) {
		marker._latLng = e.detail.target._latlng;
		draggable = false;
	}

	let tooltipOptions = {
		direction: 'bottom',
	};
</script>

<Marker
	bind:this={marker._node}
	latLng={marker._latLng}
	icon={getMarkerIcon(marker.type)}
	events={['popupclose', 'dragend']}
	on:dragend={_handle_dragend}
	on:popupclose={_handle_popupclose}
>
	<Tooltip options={tooltipOptions}>
		{getDungeonTypeName(marker.type)}
	</Tooltip>

	<Popup>
		<fieldset disabled={!editable}>
			<legend>
				ℹ️ Info
				{#if marker.timestamp}
					<span class="timestamp">
						⌚: {new Date(marker.timestamp).toJSON()}
					</span>
				{/if}
			</legend>

			<img
				class="dungeon-img"
				alt="dungeon image"
				src={getDungeonImageUrl(marker.type)}
				width="128"
			/>

			<label class="flex">
				Type:
				<DungeonSelector bind:type={marker.type} />
			</label>

			<label class="flex">
				Name:
				<input type="text" bind:value={marker.name}>
			</label>

			<details>
				<summary>Position:</summary>
				<div>
					<LatLngInput latLng={marker._latLng} />
				</div>
			</details>
		</fieldset>

		<hr>

		<div class="action-btns-box">
			<div class="flex flex-gap-1">
				<label class="flex">
					<input type="checkbox" bind:checked={editable}>
					<span>
					Edit
					</span>
				</label>

				<label class="flex">
					<input type="checkbox" disabled={!editable} bind:checked={draggable}>
					<span>
					Drag
					</span>
				</label>
			</div>


			<div>
				<button
					disabled={!editable}
				>
					⇧ Upload
				</button>
				<button
					disabled={!editable}
				>
					Check
				</button>
			</div>
		</div>
	</Popup>

</Marker>


<style>
.dungeon-img {
	display: block;
	margin: auto;
	image-rendering: pixelated;
}

.timestamp {
	font-family: monospace;
	font-size: small;
	opacity: 0.5;
}
</style>

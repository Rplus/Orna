<script>
	import { createEventDispatcher } from 'svelte';

	// const dataUrl = 'https://opensheet.elk.sh/1u89k2oUXRFOLIqVCm6bGXD-2pugwj7RIhM1qBKbT9Zg/data';
	// import dataUrl from '../marker.geojson?url';
	// import dataUrl from '../fake.data.geo.json?url';
	import { urls, uuid, } from './consts.js';

	import { ioHQ, dungeonVisibility, map, filters, } from '../stores.js';
	import Dialog from './Dialog.svelte';
	import DungeonMarker from './DungeonMarker.svelte';

	import {
		getDungeonImageUrl,
		imgPathToName,
		getDungeonTypeName,
		postData,
	} from './u.js';

	$: _map = $map && $map.getMap && $map.getMap();

	loadData(true);

	const props = ['index', 'lat', 'lng', 'type', 'name', 'timestamp', 'note',];

	let markers = [];
	let tempMarkers = [];

	function transData(data) {
		return data
		.filter(i => Number(i.lng) && Number(i.lat))
		.map(i => {
			return {
				...i,
				// index: i.index || +new Date(),
				_latLng: L.GeoJSON.coordsToLatLng([i.lng, i.lat]),
			}
		});
	}

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

	function createBuilding() {
		let center = _map.getCenter();

		tempMarkers[tempMarkers.length] = {
			index: +new Date(),
			lat: center.lat,
			lng: center.lng,
			_temp: true,
			_latLng: center,
		};
	}

	let dungeonVisibilityStyle = '';
	$: {
		let selectors = $dungeonVisibility
			.filter(i => i.visible)
			.map(i => `.dungeon-icon.dungeon-icon.dungeon-icon--${i.id}`).join();
		dungeonVisibilityStyle = selectors ? `<style>${selectors}{display:unset;}</style>` : '';
	}

	$: isUploading = false; // allow upload only one marker data at same time
	function uploadMarker(e) {
		if (isUploading) {
			alert('Uploading another marker data, please wait.');
			return;
		}

		let marker = e.detail;

		let newMarker = {
			index: (!marker._temp && marker.index) ? marker.index : null,
			lat: marker._latLng.lat,
			lng: marker._latLng.lng,
			name: marker.name || '',
			type: marker.type || '',
			uuid,
		}

		isUploading = true;
		// post to gdrive~
		postData(urls.post, newMarker)
			.then(data => {
				console.log(data);
				loadData(false);
			})
			.catch(error => {
				// loadData(false);
				window.alert(error);
				console.error(error);
			})
			.finally(() => {
				isUploading = false;
				window.alert('Upload succeeded!');
			})
	}
	$: {
		document.documentElement.classList.toggle('is-uploading', isUploading);
	}

	$: {
		$filters;
		loadData();
	}

	function loadData(bindChecker = false) {
		let filter = Object.values($filters).map(Number).join('');
		let url = urls.get + `&filter=${filter}`;
		fetch(url).then(r => r.json()).then(data => {
			console.log('fetched Data', data.data);
			markers = transData(data.data);

			// reset temp markers
			tempMarkers = [];

			if (bindChecker) {
				_map.on('moveend', checkMarkersInView);
			}
			checkMarkersInView();
		});
	}

</script>

<svelte:head>
	{@html dungeonVisibilityStyle}
</svelte:head>

{#each markers as marker (marker.index) }
	{#if marker._inview}
		<DungeonMarker bind:marker={marker} on:upload={uploadMarker} />
	{/if}
{/each}


{#each tempMarkers as marker (marker.index) }
	<DungeonMarker bind:marker={marker} on:upload={uploadMarker} />
{/each}

<!-- DungeonCtrl panel -->
{#if $ioHQ.openedPanel === 'dungeon'}

<Dialog>
	<h3>
		<button on:click={createBuilding}>+</button>
		Dungeons
		<br>
		<small>
			count: {markers.length}
		</small>
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

:global(:root.is-uploading) {
	pointer-events: none;
}
:global(:root.is-uploading::before) {
	content: '⌛ Uploading...';
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	text-align: center;
	font-size: 2em;
	font-weight: 900;
	line-height: 2;
	background-color: #0006;
	color: #fff;
	z-index: 10000;
}
</style>

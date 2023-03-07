<script>
	import Alt from './lib/Alt.svelte';
	import Dungeons from './lib/Dungeons.svelte';
	import Toolbar from './lib/Toolbar.svelte';
	import Location from './lib/Location.svelte';
	import SettingCtrl from './lib/SettingCtrl.svelte';
	import { LeafletMap, ScaleControl, } from 'svelte-leafletjs';
	import { layers, labels, } from './lib/map-layers.js';
	import { saveItem, getItem, } from './lib/u.js';
	import * as stores from './stores.js';

	let map;
	let mapZoomLevel = 15;
	let mapZoomLevelThreshold = 12;

	const mapOptions = {
		center: [25.050438312613306, 121.57201409339905],
		zoom: mapZoomLevel,
	};

	let mapInited = false;
	$: {
		if (map && !mapInited) {
			mapInit();
			stores.map.set(map);
		}
	}
	function mapInit() {
		mapInited = true;
		let _map = map.getMap();

		// init layers
		let layerName = getItem('custom-layer') || 'Stamen.Watercolor';
		layers[layerName].addTo(_map);
		L.control.layers(layers, labels).addTo(_map);

		//
		toolbarInit(_map);
	}
	function toolbarInit(_map) {
		let toolbar = L.control({ position: 'bottomleft', });
		let toolbarComponent;
		toolbar.onAdd = (map) => {
			let div = L.DomUtil.create('div');
			toolbarComponent = new Toolbar({
				target: div,
			});
			return div;
		}
		toolbar.onRemove = () => {
			if(toolbarComponent) {
				toolbarComponent.$destroy();
				toolbarComponent = null;
			}
		};
		toolbar.addTo(_map);
	}


	let showVD = true;
	let clicktype = '';

	function clickMap({ detail }) {
		// console.log('clickmap', clicktype, [lat, lng]);
		// let { lat, lng } = e.detail.latlng;
		switch (clicktype) {
			case 'vd':
				break;

			case 'dungeon':
				console.log(`新增DG@${detail.latlng}`);
				break;

			default:
				break;
		}
	}

	function zoomMap({ detail }) {
		mapZoomLevel = detail.target._zoom
	}

	// function reRender({ detail }) {
	// 	map.getMap().flyTo(detail);
	// }

	function saveLayer({ detail }) {
		console.log('123');
		saveItem('custom-layer', detail.name);
	}
</script>





<div
	class="map-box"
	class:hide-marker={mapZoomLevel < mapZoomLevelThreshold}
>
	<LeafletMap
		bind:this={map}
		options={mapOptions}
		events={['zoom', 'click', 'baselayerchange']}
		on:zoom={zoomMap}
		on:click={clickMap}
		on:baselayerchange={saveLayer}
	>
		<Location />

		<Alt />

		<Dungeons />

		<SettingCtrl />

		<ScaleControl
			position="bottomright"
			options={{ maxWidth: 200, imperial: 0, }}
		/>
	</LeafletMap>
</div>



<style>
</style>

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
	import { ioHQ } from './stores.js';
	import * as lodash from 'lodash-es';

	let map;
	let mapZoomLevel = 15;
	let _map;


	let mapInited = false;
	$: {
		if (map && !mapInited) {
			mapInit();
			stores.map.set(map);
		}
	}
	function mapInit() {
		mapInited = true;
		_map = map.getMap();

		// init layers
		let layerName = getItem('custom-layer') || 'Stamen.Watercolor';
		layers[layerName].addTo(_map);
		L.control.layers(layers, labels).addTo(_map);

		_map.on('moveend', lodash.debounce(updateMapCenter, 300));

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

	function saveLayer({ detail }) {
		saveItem('custom-layer', detail.name);
	}

	function updateMapCenter(e) {
		let center = _map?.getCenter();
		if (center) {
			$ioHQ.mapOptions = {
				center: [center.lat || 0, center.lng || 0],
				zoom: e.target._zoom,
			}
		}
	}
</script>





<div class="map-box">
	<LeafletMap
		bind:this={map}
		options={$ioHQ.mapOptions}
		events={['baselayerchange']}
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

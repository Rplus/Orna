<script>
	import {
		Circle,
		Marker,
		Tooltip,
		Popup,
	} from 'svelte-leafletjs';
	import { map } from '../stores.js';
	import { genBase64EmojiSvg } from './u.js';

	let _map = null;
	$: {
		if ($map && $map.getMap) {
			_map = $map && $map.getMap && $map.getMap();
			_map
				.on('locationfound', _handle_locationfound)
				.on('locationerror', _handle_locationerror)
		}
	}

	$: location = null;
	function _handle_locationfound(detail) {
		_map.flyTo(detail.latlng);
		location = {
			latlng: detail.latlng,
			accuracy: detail.accuracy,
		};
	}
	function _handle_locationerror() {
		location = null;
	}

	let locationIcon = L.icon({
		iconUrl: genBase64EmojiSvg('🚶‍♀️'),
		iconSize: [48, 48],
		iconAnchor: [24, 40],
		popupAnchor: [0, -40],
	});

</script>


{#if location}
	<Marker latLng={location.latlng} icon={locationIcon} zIndexOffset={-1}>
		<Circle
			latLng={location.latlng}
			radius={location.accuracy}
			weight="2"
			dashArray="4 6"
		/>
		<Popup>
			<!-- ⌖ 🚶‍♀️ -->
			<img src={genBase64EmojiSvg('🚶‍♀️')} alt="">
			<br>
			{location.latlng}
			<br>
			{location.accuracy}
		</Popup>
	</Marker>
{/if}

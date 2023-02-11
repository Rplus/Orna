<script>
	import { map } from '../stores.js';

	$: _map = $map && $map.getMap && $map.getMap();

	function locate() {
		_map?.locate();
	}

</script>


<button
	class="btn-with-icon leaflet-bar"
	disabled={!$map}
	on:click={locate}
>
	🚶‍♀️
</button>

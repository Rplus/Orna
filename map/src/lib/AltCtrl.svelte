<script>
	import { ioHQ } from '../stores.js';

	function toggleAltDialog() {
		$ioHQ.altDialog = !$ioHQ.altDialog;
	}
</script>



<button
	class="btn-with-icon leaflet-bar"
	on:click={toggleAltDialog}
>
	📍
</button>


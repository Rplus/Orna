<script>
	export let latLng = {};
	export let readonly = false;
</script>

<label class="flex">
	<span class="dir-icon">↕</span><code>Lat</code>
	<input type="number" bind:value={latLng.lat} step="0.001" {readonly}>
</label>


<label class="flex">
	<span class="dir-icon">↔</span><code>Lng</code>
	<input type="number" bind:value={latLng.lng} step="0.001" {readonly}>
</label>


<style>
.dir-icon {
	display: inline-block;
	width: 1em;
	text-align: center;
}
</style>

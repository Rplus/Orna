<script>
	export let active = false;
	export let icons = ['o', 'x'];

	function toggle() {
		active = !active;
	}
</script>



<button on:click|stopPropagation={toggle} class="btn-with-icon leaflet-bar">
	{ active ? icons[0] : icons[1]}
</button>

<script>
  import {getContext, onDestroy, createEventDispatcher} from 'svelte';
	import AltCtrl from './AltCtrl.svelte';
	import CreateCtrl from './CreateCtrl.svelte';
	import LocateCtrl from './LocateCtrl.svelte';
	import SettingCtrl from './SettingCtrl.svelte';
	import ToggleButton from './ToggleButton.svelte';

	let active = !false;

</script>


<div class="toolbar" on:dblclick|stopPropagation>
	<div hidden={!active} class="toolbar-menu">
		<LocateCtrl />
		<br><br>
		<CreateCtrl />
		<AltCtrl />
		<SettingCtrl />
		<br><br>
	</div>
	<ToggleButton bind:active={active} icons={['🗙', '☰']} />
</div>


<style>
.toolbar {
	font-size: 1.15rem;
}
.toolbar-menu:not([hidden]) {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	width: min-content;
}
</style>


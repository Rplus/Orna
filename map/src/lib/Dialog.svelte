<script>
	import { ioHQ } from '../stores.js';

	function closePanel() {
		$ioHQ.openedPanel = ''
	}
</script>

<dialog open
	on:dblclick|stopPropagation
	on:click|stopPropagation
	on:mousedown|stopPropagation
	on:touchstart|stopPropagation
	on:wheel|stopPropagation
>
	<button class="close-btn" on:click|stopPropagation={closePanel} />

	<slot />
</dialog>

<style>

dialog {
	position: fixed;
	top: 0;
	left: unset;
	right: 0;
	z-index: 1000;
	height: 100vh;
	margin: unset;
	overflow-y: auto;
	overflow-x: hidden;
}

dialog :global(h3) {
	margin: .25em 0 .75em;
	text-align: center;
	border-bottom: 1px dotted #0003;
}

.close-btn {
	position: absolute;
	top: 0;
	left: 0;
	margin: 0;
	padding: 0;
	display: inline-flex;
  place-content: center;
  place-items: center;
  cursor: pointer;
  opacity: 0.35;
  border: 2em solid #0002;
  border-right-color: #0000;
  border-bottom-color: #0000;
  background: transparent;
}

.close-btn:focus-visible {
	outline: 2px solid #000;
}

.close-btn::before {
	content: '🗙';
	color: #000;
	position: absolute;
  font-size: 2rem;
}
</style>

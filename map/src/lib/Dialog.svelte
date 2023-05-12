<script>
	import { ioHQ } from '../stores.js';

	function closePanel() {
		$ioHQ.openedPanel = ''
	}

	function shrinkPanel() {
		$ioHQ.shrinkPanel = !$ioHQ.shrinkPanel;
		console.log('$ioHQ.shrinkPanel', $ioHQ.shrinkPanel);
	}
</script>

<dialog open
	on:dblclick|stopPropagation
	on:click|stopPropagation
	on:mousedown|stopPropagation
	on:touchstart|stopPropagation
	on:wheel|stopPropagation
	class:shrink={$ioHQ.shrinkPanel}
>
	<button
		class="dialog-btn close-btn"
		on:click|stopPropagation={closePanel}
	/>

	<button
		class="dialog-btn shrink-btn"
		on:click|stopPropagation={shrinkPanel}
	/>

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
	min-width: 250px;
	margin: unset;
	overflow-y: auto;
	overflow-x: hidden;
	background: #fffc;
	border: unset;
	box-shadow: 0 0 .5em #000;
	transition: height .1s;
}

dialog.shrink {
	/* overflow-y: hidden; */
	height: 4.5em;
}

dialog :global(h3) {
	margin: .25em 0 .75em;
	text-align: center;
	border-bottom: 1px dotted #0003;
}

.dialog-btn {
	position: absolute;
	top: 0;
	margin: 0;
	padding: 0;
	display: inline-flex;
  place-content: center;
  place-items: center;
  cursor: pointer;
  opacity: 0.5;
  border: 2em solid #0003;
  border-bottom-color: #0000;
  background: transparent;
}

.dialog-btn:focus-visible {
	outline: 2px solid #000;
}

.dialog-btn::before {
	content: var(--dialog-btn-symbol, '');
	color: #000;
	position: absolute;
  font-size: 2rem;
  line-height: 0;
}

.close-btn {
	--dialog-btn-symbol: '✕';
	left: 0;
  border-right-color: #0000;
}

.shrink-btn {
	--dialog-btn-symbol: '🗁';
	right: 0;
  border-left-color: #0000;
}
dialog.shrink .shrink-btn {
	--dialog-btn-symbol: '🗀';
}
</style>

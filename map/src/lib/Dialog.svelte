<dialog open
	on:dblclick|stopPropagation
	on:click|stopPropagation
	on:mousedown|stopPropagation
	on:touchstart|stopPropagation
	on:wheel|stopPropagation
>
	<slot />
</dialog>

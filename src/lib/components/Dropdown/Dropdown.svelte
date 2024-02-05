<script>
	import { onMount, afterUpdate } from 'svelte';
	import { fade } from 'svelte/transition';
	let openDropdown = false;
	/** @type {HTLMElement}*/
	let refBody;
	/** @type {HTLMElement}*/
	let refButton;

	function handleCloseOut(event) {
		if (!event.srcElement.closest('.dropdown-button')) {
			openDropdown = false;
		}
	}
	function toggleDropDown(ev) {
		if (openDropdown) {
			window.removeEventListener('click', handleCloseOut);
		} else {
			window.addEventListener('click', handleCloseOut);
			openDropdown = true;
		}
	}
	afterUpdate(() => {
		if (refBody) {
			const bounding = refButton.getBoundingClientRect();
			refBody.style.top = bounding.height + 5 + 'px';
		}
	});
</script>

<div class="dropdown">
	<button bind:this={refButton} class="dropdown-button" on:click={toggleDropDown}>
		<slot name="button" />
	</button>
	{#if openDropdown}
		<div bind:this={refBody} transition:fade>
			<slot />
		</div>
	{/if}
</div>

<style>
	.dropdown {
		border-radius: 10px;
		position: relative;
		color: white;
		z-index: 20;
		& > div {
			position: absolute;
			right: 0;
		}
		& > button {
			background-color: transparent;
			color: white;
			border: none;
			appearance: none;
		}
	}
</style>

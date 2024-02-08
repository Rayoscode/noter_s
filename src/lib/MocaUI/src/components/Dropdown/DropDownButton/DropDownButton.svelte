<script lang="ts">
	import { onMount } from 'svelte';
	export let shouldCloseOnClick: boolean = true;
	export let onClick = () => {};
	export let className = '';
	let parentRef: Element;
	let buttonRef: Element;

	onMount(() => {
		parentRef = buttonRef.closest('.ui-dropdown') as Element;
	});

	function handleClickEvent() {
		if (shouldCloseOnClick) {
			parentRef.setAttribute('open', 'false');
		}
		onClick();
	}
</script>

<button class="ui-dropdown-button {className}" bind:this={buttonRef} on:click={handleClickEvent}>
	<slot />
</button>

<style>
	:global(.ui-dropdown-button) {
		appearance: none;
		border: none;
		display: block;
		color: var(--color-text);
		background-color: inherit;
		cursor: pointer;
	}
</style>

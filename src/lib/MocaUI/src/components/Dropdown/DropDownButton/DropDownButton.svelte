<script lang="ts">
	import { onMount } from 'svelte';
	export let shouldCloseOnClick: boolean = true;
	export let onClick = () => {};
	let parentRef: Element;
	let buttonRef: Element;
	onMount(() => {
		parentRef = buttonRef.closest('.dropdown') as Element;
	});
	function handleClickEvent() {
		if (shouldCloseOnClick) {
			parentRef.open = 'false';
			onClick();
		}
	}
</script>

<button bind:this={buttonRef} on:click={handleClickEvent}>
	<slot />
</button>

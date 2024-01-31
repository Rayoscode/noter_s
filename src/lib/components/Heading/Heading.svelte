<script>
	import { onMount } from 'svelte';
	/**
	 * @type {1 | 2 | 3 | 4 | 5 | 6} content
	 */
	export let level = 1;
	/**
	 * @type {DocumentFragment | string} content
	 */
	export let content;

	/**
	 * @type {HTMLElement} lineRef
	 */
	let lineRef;
	onMount(() => {
		if (content) {
			lineRef.append(content);
		} else {
			lineRef.innerHTML = '<br>';
		}
	});
</script>

<svelte:element this={`h${level}`} class="heading line text-editable component" bind:this={lineRef}
></svelte:element>

<style>
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		margin: 2px 0;
	}
</style>

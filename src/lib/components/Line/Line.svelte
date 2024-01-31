<script>
	import { onMount } from 'svelte';

	/** @type { DocumentFragment | string | Text } content */
	export let content;

	/**
	 * @type {HTMLElement} lineRef
	 */
	let lineRef;
	onMount(() => {
		if (content instanceof DocumentFragment) {
			lineRef.append(content);
			return;
		}
		if (typeof content === 'string') {
			lineRef.innerText = content;
			return;
		}
		if (content instanceof Text) {
			lineRef.append(content);
		} else {
			lineRef.innerHTML = '<br>';
		}
	});
</script>

<p class="line component text-editable" bind:this={lineRef}></p>

<style>
	p {
		margin: 0;
	}
</style>

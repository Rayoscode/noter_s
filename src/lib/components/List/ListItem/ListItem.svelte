<script>
	import { onMount } from 'svelte';
	export let todo;
	/** @type {DocumentFragment} */
	export let content;
	/** @type {HTMLElement}*/
	let ref;
	/** @type {HTMLElement}*/
	onMount(() => {
		if (content && (content.hasChildNodes() || content.textContent !== '')) {
			ref.append(content);
		} else {
			ref.innerHTML = '<br>';
		}
	});
	/** @type {(ev:InputEvent) => void} */
</script>

{#if todo}
	<li class="list-item component" contenteditable="false">
		<input type="checkbox" />
		<div>
			<span contenteditable="true" class="text-editable" bind:this={ref}> </span>
		</div>
	</li>
{:else}
	<li bind:this={ref} class="list-item component text-editable"></li>
{/if}

<style>
	.list.todo > li {
		display: flex;
		flex-direction: row;
	}
</style>

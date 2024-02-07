<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	export let css: string = '';
	export let className: string = '';
	// TODO: Definir los tipos existentes y que se haga extensible
	export let variant: string = '';
	export let buttonProps: HTMLButtonAttributes;
</script>

<button class="ui-button {variant} {className}" on:click={buttonProps['on:click']} style={css}>
	<slot />
</button>

<style>
	:global(.ui-button) {
		appearance: none;
		border: none;
		background-color: var(--bg-button);
		border-radius: var(--rounded-button);
		border: var(--border-button);
		box-shadow: var(--shadow-button);
		color: var(--color-text);
		cursor: pointer;
		transition: var(--button-transition);
	}
</style>

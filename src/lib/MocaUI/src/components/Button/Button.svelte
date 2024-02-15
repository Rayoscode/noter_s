<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import buttonAction, { type ButtonElementProps } from './ButtonAction';
	export let css: string = '';
	export let className: string = '';
	// TODO: Definir los tipos existentes y que se haga extensible
	export let variant: string = 'default';
	export let buttonProps: ButtonElementProps | undefined = {};
</script>

<button use:buttonAction={buttonProps} class="ui-button {variant} {className}" style={css}>
	<slot />
</button>

<style>
	:global(.ui-button) {
		appearance: none;
		border: none;
		transition: all 0.3s ease;
		/* background-color: var(--bg-button);
		border-radius: var(--rounded-button);
		border: var(--border-button);
		box-shadow: var(--shadow-button);
		color: var(--color-text-primary); */
		cursor: pointer;
		/* transition: var(--button-transition); */
	}
</style>

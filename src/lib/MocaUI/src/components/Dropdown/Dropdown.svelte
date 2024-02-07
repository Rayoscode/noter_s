<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '../Button/Button.svelte';
	export let onClickTrigger = () => {};
	let container: HTMLElement;
	let content: Element;
	let positionContent = { top: 0, left: 0 };
	onMount(() => {
		container.setAttribute('open', 'false');
		const buttonElement = container.firstElementChild;
		const rects = buttonElement?.getBoundingClientRect();
		positionContent = { top: rects?.height as number, left: 0 };
	});
	const onClickButtonOpener = () => {
		const open = container.getAttribute('open');
		container.setAttribute('open', open === 'true' ? 'false' : 'true');

		if (open === 'true') {
			window.removeEventListener('click', clickOnOpenedDropdown);
			container.setAttribute('open', 'false');
		} else {
			window.addEventListener('click', clickOnOpenedDropdown);
		}
	};
	const clickOnOpenedDropdown = (ev: MouseEvent) => {
		if (!(ev.target as Element).closest('.dropdown')) {
			window.removeEventListener('click', clickOnOpenedDropdown);
			container.setAttribute('open', 'false');
		}
		console.log('pasanding');
		ev.preventDefault();
	};
</script>

<div class="dropdown" bind:this={container} open="false">
	<Button
		buttonProps={{
			'on:click': () => {
				onClickButtonOpener();
				onClickTrigger();
			}
		}}
	>
		<slot name="button-trigger" />
	</Button>
	<button on:click={onClickButtonOpener}> </button>

	<div bind:this={content} style="top:{positionContent.top}px;left:0;" class="dropdown-content">
		<slot />
	</div>
</div>

<style>
	.dropdown {
		position: relative;
		display: inline-block;
	}
	.dropdown-content {
		width: auto;
		height: auto;
		transition:
			translate 0.3s var(--ease-elastic-in-out-4),
			scale 0.4s var(--ease-5) 0.1s,
			opacity 0.3s var(--ease-4);
		position: absolute;
	}
	:global(.dropdown[open='true'] > .dropdown-content) {
		transition:
			translate 0.3s var(--ease-elastic-in-out-4),
			scale 0.2s var(--ease-5),
			opacity 0.4s var(--ease-4);
		position: absolute;

		scale: 100% 100%;
		/* translate: 0 0; */
		opacity: 1;
	}
	.dropdown[open='false'] > .dropdown-content {
		scale: 0;
		/* translate: 0 20px; */
		opacity: 0;
	}
	button {
		appearance: none;
		border: none;
		background-color: inherit;
		color: var(--var-text-color);
		cursor: pointer;
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '../Button/Button.svelte';
	import { events } from '$lib/core/BasicEvents/basicEvents';
	export let onClickTrigger = () => {};
	let container: HTMLElement;
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
		if (!(ev.target as Element).closest('.ui-dropdown')) {
			window.removeEventListener('click', clickOnOpenedDropdown);
			container.setAttribute('open', 'false');
		}
		ev.preventDefault();
	};
</script>

<div class="ui-dropdown" bind:this={container} open="false">
	<Button
		buttonProps={{
			events: {
				click: () => {
					onClickButtonOpener();
					onClickTrigger();
				}
			}
		}}
	>
		<slot name="button-trigger" />
	</Button>
	<div style="top:{positionContent.top}px;left:0;" class="ui-dropdown-content">
		<slot />
	</div>
</div>

<style>
	.ui-dropdown {
		position: relative;
		display: inline-block;
	}
	.ui-dropdown-content {
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
		scale: 100%;
		opacity: 1;
	}
	.ui-dropdown[open='false'] > .ui-dropdown-content {
		scale: 0;
		opacity: 0;
	}
</style>

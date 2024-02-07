<script lang="ts">
	import { onMount } from 'svelte';
	let container: HTMLElement;

	onMount(() => {
		container.setAttribute('data-open', 'false');
	});
	const onClickButtonOpener = () => {
		container.setAttribute(
			'data-open',
			container.getAttribute('data-open') === 'true' ? 'false' : 'true'
		);
	};
	const handleChangeDropDownState = () => {};
</script>

<div class="dropdown" data-open={'false'} bind:this={container}>
	<button on:click={onClickButtonOpener}>
		<slot name="button-trigger" />
	</button>
	<div class="dropdown-content">
		<slot />
	</div>
</div>

<style>
	.dropdown-content {
		transition: all 0.3s ease;
	}
	:global(.dropdown[data-open='true'] > .dropdown-content) {
		display: block;
		opacity: 1;
	}

	.dropdown[data-open='false'] > .dropdown-content {
		display: none;
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

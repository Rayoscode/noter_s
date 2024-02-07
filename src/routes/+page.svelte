<script lang="ts">
	import { Editor } from '$lib/core/Editor/Editor';
	import { BasicEditorCommands } from '$lib/core/constants/BasicEditorCommands';
	import { listCommands } from '$lib/components/List/commands/ListCommands';
	import { codeBlocksCommands } from '$lib/components/Codeblock/commands/CodeBlockCommands';
	import { UIComponents } from '$lib/core/constants/BasicUIComponents';
	import { onMount } from 'svelte';
	import Toolbar from '$lib/components/toolbar/Toolbar.svelte';
	import Dropdown from '$lib/MocaUI/src/components/Dropdown/Dropdown.svelte';
	let ref: HTMLElement;
	let editor: Editor;
	onMount(() => {
		editor = new Editor(
			{ ...BasicEditorCommands, ...listCommands, ...codeBlocksCommands },
			UIComponents
		);
		editor.attachContentManager('1', ref);
		document.addEventListener('selectionchange', (ev) => {
			// console.log(ev, getSelection(), 'selection');
		});
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<Dropdown>
	<svelte:fragment slot="button-trigger">
		<span>Abrir </span>
	</svelte:fragment>
	<p>Holi</p>
</Dropdown>

<div class="content" bind:this={ref}></div>
<Toolbar {editor}></Toolbar>

<style>
	:global(html) {
		background-color: #212121;
		color: white;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif;
	}
	.content {
		margin: 10px;
		padding: 10px;
		min-height: 20vh;
	}
</style>

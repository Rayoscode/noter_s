<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import hljs from 'highlight.js';
	import Dropdown from '../Dropdown/Dropdown.svelte';
	/** @type {HTMLElement}*/
	let ref;
	const languages = [
		'javascript',
		'java',
		'c',
		'cpp',
		'json',
		'rust',
		'sql',
		'php',
		'html',
		'css',
		'vue',
		'angular',
		'wast',
		'ast'
	];
	let languageSelected = 'javascript';
	let content = '';
	let preRef: HTMLElement;
	let caretRef: HTMLElement;
	const handleSelectionChangeOfCaret = () => {
		const range = getSelection()?.getRangeAt(0);
		const rect = range?.getBoundingClientRect() as DOMRect;
		caretRef.style.top = `${rect?.y - preRef.getBoundingClientRect().top}px`;
		caretRef.style.left = `${rect.x - preRef.getBoundingClientRect().left}px`;
	};
	const handleBeforeInput = (ev:InputEvent) => {
		if (ev.target.outerText === '') {
			ev.preventDefault();
			return;
		}
		if(ev.inputType === 'insertText'){
			document.execCommand('insertText',false,ev.data as string)
			const result = hljs.highlight(ev.target.outerText, { language: languageSelected });
			preRef.innerHTML = result.value;
			ev.stopImmediatePropagation()
			ev.preventDefault()
			return
		}
		if(ev.inputType === 'insertLineBreak'){
			document.execCommand('insertLineBreak')
			const result = hljs.highlight(ev.target.outerText, { language: languageSelected });
			preRef.innerHTML = result.value;
			ev.stopImmediatePropagation()
			ev.preventDefault()
			return
		}
		if(ev.inputType === 'deleteContentBackward'){
			document.execCommand('delete')
			const result = hljs.highlight(ev.target.outerText, { language: languageSelected });
			preRef.innerHTML = result.value;
			handleSelectionChangeOfCaret()
			ev.stopPropagation()
			ev.preventDefault()
			return			
		}
	}
	const handleFocusIn = () => {
		document.addEventListener('selectionchange', handleSelectionChangeOfCaret);
	};
	const handleFocusOut = () => {
		document.removeEventListener('selectionchange', handleSelectionChangeOfCaret);
	};
	onMount(() => {
		let result = hljs.highlight(content, { language: languageSelected });
		preRef.innerHTML = result.value;
	});
	afterUpdate(() => {
		const result = hljs.highlight(preRef.outerText, { language: languageSelected });
		preRef.innerHTML = result.value;
	});
	function keyDownHandler(event:KeyboardEvent){
		if(event.key === 'z' && event.ctrlKey){
			document.execCommand('undo')
			const result = hljs.highlight(content, { language: languageSelected });
			preRef.innerHTML = result.value;
			handleSelectionChangeOfCaret()
			event.preventDefault()
			event.stopPropagation()
		}

		if(event.key === 'y' && event.ctrlKey){
			document.execCommand('redo')
			const result = hljs.highlight(content, { language: languageSelected });
			preRef.innerHTML = result.value;
			handleSelectionChangeOfCaret()
			event.preventDefault()
			event.stopPropagation()

		}
		return
	}
</script>

<div class="code-block" contenteditable="false" spellcheck="false">
	<div class="code-container" bind:this={ref}>
		<pre
			on:beforeinput={handleBeforeInput}
			on:focusin={handleFocusIn}
			on:focusout={handleFocusOut}
			on:keydown={keyDownHandler}
			class="text-code-area"
			contenteditable="plaintext-only"
			bind:textContent={content}></pre>
		<pre bind:this={preRef}></pre>
		<div bind:this={caretRef} class="code-caret"></div>
	</div>
	<div class="dropdown-container">
		<Dropdown>
			<span slot="button">
				{languageSelected}
			</span>
			<ul>
				{#each languages as language}
					<li>
						<button
							on:click={() => {
								languageSelected = language;
							}}
						>
							{language}
						</button>
					</li>
				{/each}
			</ul>
		</Dropdown>
	</div>
</div>

<style>
	[contenteditable='plaintext-only']{
		&:focus{
			border: none;
			outline: none;
		}
		
	}
	pre:focus ~ .code-caret {
		display: block;
	}
	.code-caret {
		display: none;
		position: absolute;
		width: 1px;
		height: 15px;
		background-color: white;
	}
	.code-container {
		border-radius: 10px;
		position: relative;
		width: 100%;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		background-color: var(--var-night);
		min-height: 40px;
		height: auto;
		z-index: 10;
		& > .text-code-area {
			opacity: 1;
			color: transparent;
			width: 100%;
			height: 100%;
			z-index: 20;
			padding: 8px;
			margin: 0;
			grid-row: 1 / 1;
			grid-column: 1 / 1;
		}
		& > pre {
			width: 100%;
			padding: 8px;
			margin: 0;
			height: 100%;
			z-index: 10;
			grid-row: 1 / 1;
			grid-column: 1 / 1;
		}
	}
	.code-block {
		margin: 1rem 0;
		position: relative;
		& .dropdown-container {
			position: absolute;
			top: 0.25rem;
			opacity: 0;
			right: 0.5rem;
			transition: opacity 0.3s ease-in-out;
		}
		&:hover .dropdown-container {
			opacity: 1;
		}
		& ul {
			list-style: none;
			height: 200px;
			padding: 5px 0;
			background-color: var(--var-night-light);
			overflow-y: scroll;
			width: 110px;
			border-radius: 10px;
			& li {
				width: 100%;

				& button {
					width: 100%;
					text-transform: capitalize;
					border: none;
					color: white;
					font-size: 1rem;
					background-color: var(--var-night-light);
					padding: 4px;
					cursor: pointer;
					&:hover {
						filter: brightness(120%);
					}
				}
			}
		}
		&:hover ul {
			display: block;
		}
		& span[slot='button'] {
			display: block;
			width: 90px;
			cursor: pointer;
			padding: 5px 4px;
			background-color: var(--var-night-light);
			font-size: 1rem;
			border-radius: 8px;
			text-transform: capitalize;
		}
	}
</style>

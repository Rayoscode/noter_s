<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import hljs from 'highlight.js';
	import Dropdown from '../Dropdown/Dropdown.svelte';
	import type { FormEventHandler } from 'svelte/elements';
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
	let content = 'let p = 5';
	let preRef: HTMLElement;
	let caretRef: HTMLElement;
	const handleSelectionChangeOfCaret = () => {
		const range = getSelection()?.getRangeAt(0);
		const rect = range?.getBoundingClientRect() as DOMRect;
		caretRef.style.top = `${rect?.y - preRef.getBoundingClientRect().top}px`;
		caretRef.style.left = `${rect.x - preRef.getBoundingClientRect().left}px`;
	};
	const inputTextHandler = (ev: InputEvent) => {
		if (ev.target.outerText === '') {
			ev.preventDefault();
			return;
		}
		if (ev.inputType === 'insertText') {
			document.execCommand('insertText', false, ev.data as string);
		}
		if (ev.inputType === 'deleteContentBackward' && ev.target.outerText !== '') {
			document.execCommand('delete');
		}
		if (ev.inputType === 'insertParagraph') {
			document.execCommand('insertParagraph');
		}
		const result = hljs.highlight(ev.target.outerText, { language: languageSelected });
		preRef.innerHTML = result.value;
		ev.preventDefault();
		ev.stopPropagation();
	};
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
</script>

<div class="code-block" contenteditable="false" spellcheck="false">
	<div class="code-container" bind:this={ref}>
		<pre
			on:input={inputTextHandler}
			on:focusin={handleFocusIn}
			on:focusout={handleFocusOut}
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
		min-height: 100px;
		z-index: 10;
		& > .text-code-area {
			opacity: 1;
			color: transparent;
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 20;
			padding: 0;
			margin: 0;
		}
		& > pre {
			width: 100%;
			padding: 0;
			margin: 0;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 10;
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
			background-color: #212121;
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
					background-color: #212121;
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
			background-color: #212121;
			font-size: 1rem;
			border-radius: 8px;
			text-transform: capitalize;
		}
	}
</style>

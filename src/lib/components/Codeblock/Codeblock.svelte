<script lang="ts">
	import { onMount } from 'svelte';
	import hljs from 'highlight.js';
	// NOTE: Quiza es mejor para el numero de la linea, dentro de la div line element, insertarlo en un span el numero, ya que con el split tenemos el index, y ahi vamos a poder modificar el espacio
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
	let content = '\n';
	let preRef: HTMLElement;
	let caretRef: HTMLElement;
	function splitByNewLineCode(code: string): string[] {
		let indexNewLine = code.indexOf('\n');
		if (code === '') {
			return [];
		}
		if (indexNewLine === -1) {
			return [code];
		} else {
			return [code.slice(0, indexNewLine), ...splitByNewLineCode(code.slice(indexNewLine + 1))];
		}
	}
	const handleSelectionChangeOfCaret = () => {
		const range = getSelection()?.getRangeAt(0);
		const rect = range?.getBoundingClientRect() as DOMRect;
		caretRef.style.top = `${rect?.y - preRef.getBoundingClientRect().top}px`;
		caretRef.style.left = `${rect.x - preRef.getBoundingClientRect().left}px`;
	};
	const handleUpdateHightLightedCode = (code: string) => {
		const result = hljs.highlight(code, { language: languageSelected });
		// debugger;
		const parsedByNewLineContent = splitByNewLineCode(result.value);
		let codeParsed = '';
		parsedByNewLineContent.forEach((line, idx) => {
			codeParsed += `<div class="code-line"><span class='code-number'>${idx + 1}</span><span>${
				line === '' ? '<br>' : line
			}</span></div>`;
		});
		preRef.innerHTML = codeParsed;
	};

	const handleBeforeInput = (ev: InputEvent) => {
		ev.preventDefault();
		if (ev.target.outerText === '') {
			return;
		}
		if (ev.inputType === 'insertText') {
			document.execCommand('insertText', false, ev.data as string);
			handleUpdateHightLightedCode(ev.target.outerText);
			ev.stopImmediatePropagation();
			ev.preventDefault();
			return;
		}
		if (ev.inputType === 'insertParagraph') {
			document.execCommand('insertLineBreak');
			handleUpdateHightLightedCode(ev?.target?.outerText as string);
			// ev.stopImmediatePropagation();
			// ev.preventDefault();
			return;
		}
		if (ev.inputType === 'insertLineBreak') {
			document.execCommand('insertLineBreak');
			handleUpdateHightLightedCode(ev?.target?.outerText as string);
			return;
		}
		if (ev.inputType === 'deleteContentBackward') {
			document.execCommand('delete');
			handleUpdateHightLightedCode(ev.target.outerText);
			handleSelectionChangeOfCaret();
			ev.stopPropagation();
			ev.preventDefault();
			return;
		}
	};

	const handleFocusIn = () => {
		document.addEventListener('selectionchange', handleSelectionChangeOfCaret);
	};

	const handleFocusOut = () => {
		document.removeEventListener('selectionchange', handleSelectionChangeOfCaret);
	};

	onMount(() => {
		handleUpdateHightLightedCode(content);
	});

	function keyDownHandler(event: KeyboardEvent) {
		if (event.key === 'z' && event.ctrlKey) {
			document.execCommand('undo');
			handleUpdateHightLightedCode(content);
			handleSelectionChangeOfCaret();
			event.preventDefault();
			event.stopPropagation();
		}

		if (event.key === 'y' && event.ctrlKey) {
			document.execCommand('redo');
			handleUpdateHightLightedCode(content);
			handleSelectionChangeOfCaret();
			event.preventDefault();
			event.stopPropagation();
		}
		return;
	}
</script>

<div class="code-block" contenteditable="false" spellcheck="false">
	<div class="code-container">
		<pre
			on:beforeinput={handleBeforeInput}
			on:focusin={handleFocusIn}
			on:focusout={handleFocusOut}
			on:keydown={keyDownHandler}
			class="text-code-area"
			contenteditable="true"
			bind:textContent={content}></pre>
		<pre class="editor-theme-custom highlighted-code" bind:this={preRef}></pre>
		<div bind:this={caretRef} class="code-caret"></div>
	</div>
	<div class="dropdown-container">
		<button>
			{languageSelected}
		</button>
		<div class="dropdown-body">
			<ul>
				{#each languages as language}
					<li>
						<button
							on:click={() => {
								languageSelected = language;
								handleUpdateHightLightedCode(content);
							}}
						>
							{language}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<style>
	[contenteditable='true'] {
		&:focus {
			border: none;
			outline: none;
		}
	}

	pre:focus ~ .code-caret {
		display: block;
	}
	.highlighted-code {
		opacity: 1;
		& > .code-line {
			& > .code-number {
				width: 32px;
				display: inline-block;
				text-align: right;
				padding-right: 8px;
			}
			line-height: 16px;
		}
	}
	.code-caret {
		display: none;
		position: absolute;
		width: 1px;
		height: 15px;
		transition: all 120ms ease-out;
		background-color: white;
	}

	.code-container {
		border-radius: 10px;
		position: relative;
		width: 100%;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		background-color: var(--var-bg-primary);
		min-height: 40px;
		height: auto;
		z-index: 10;
		& > .text-code-area {
			opacity: 1;
			color: transparent;
			width: 100%;
			height: 100%;
			z-index: 20;
			line-height: 16px;
			padding: 8px;
			padding-left: 40px;
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
			z-index: 20;
			transition: opacity 0.2s ease-in-out;
		}
		&:hover .dropdown-container {
			opacity: 1;
		}
		& .dropdown-container {
			opacity: 0;
			& > button {
				padding: 5px 10px 5px 5px;
				display: block;
				min-width: 100px;
				border-radius: var(--var-rounded-sm);
				appearance: none;
				border: none;
				background-color: var(--var-bg-secondary);
				cursor: pointer;
				font-size: 1rem;
				text-align: right;
				color: var(--var-color-text);
				&:hover ~ .dropdown-body {
					scale: 100% 100%;
				}
			}
		}
		& .dropdown-body {
			list-style: none;
			height: 200px;
			scale: 100% 0;
			padding: 5px 0;
			background-color: var(--var-night-light);
			overflow-y: scroll;
			transition: all 0.2s ease 0.1s;
			color: var(--var-color-text);
			width: 110px;
			border-radius: 10px;
			&:hover {
				scale: 100% 100%;
			}
			& li {
				width: 100%;
				color: var(--var-color-text);

				& button {
					width: 100%;
					text-transform: capitalize;
					border: none;
					font-size: 1rem;
					color: var(--var-color-text);
					background-color: var(--var-night-light);
					padding: 4px;
					cursor: pointer;
					&:hover {
						filter: brightness(120%);
					}
				}
			}
		}
		&:hover .dropdown-body {
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

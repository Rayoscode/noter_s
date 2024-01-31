<script lang="ts">
	import { Editor } from '$lib/core/Editor/Editor';
	/** @type {Editor} editor */
	export let editor: Editor;
	/** @type {(command:string)=>void} */
	function execute(command: string) {
		editor.executeCommand(command);
	}
	function handleFocus() {
		const selection = getSelection();
		const range = selection?.getRangeAt(0).cloneRange();
		selection?.removeAllRanges();
		selection?.addRange(range as Range);
	}
</script>

<ul>
	<li>
		<button
			on:click={() => {
				handleFocus();
				execute('formatBold');
			}}><img src="/bold.svg" /></button
		>
	</li>
	<li>
		<button
			on:click={() => {
				handleFocus();
				execute('formatItalic');
			}}><img src="/italic.svg" /></button
		>
	</li>
	<li>
		<button
			on:click={() => {
				handleFocus();
				execute('formatUnderline');
			}}><img src="/underline.svg" /></button
		>
	</li>
	<li>
		<button
			on:click={() => {
				handleFocus();
				editor.executeCommand('insertOrderedList', {
					manager: editor.lastLayoutFocus
				});
			}}><img src="/orderedlist.svg" /></button
		>
	</li>
	<li>
		<button
			on:click={() => {
				handleFocus();
				editor.lastLayoutFocus?.undoManager.do('insertUnorderedList', {
					editor,
					manager: editor.lastLayoutFocus
				});
			}}><img src="/unorderedlist.svg" /></button
		>
	</li>
	<li>
		<button
			on:click={() => {
				handleFocus();
				editor.lastLayoutFocus?.undoManager.do('insertTodoList', {
					editor,
					manager: editor.lastLayoutFocus
				});
			}}><img src="/list.svg" /></button
		>
	</li>
	<li>
		<button
			on:click={() => {
				handleFocus();
				editor.executeCommand('insertHeading', { level: 1 });
			}}><img src="/h1.svg" /></button
		>
	</li>
	<li>
		<button
			on:click={() => {
				handleFocus();
				editor.executeCommand('insertHeading', { level: 2 });
			}}><img src="/h2.svg" /></button
		>
	</li>
	<li>
		<button
			on:click={() => {
				handleFocus();
				editor.executeCommand('insertCodeblock', {});
			}}><img src="/code.svg" /></button
		>
	</li>
</ul>

<style>
	ul {
		list-style: none;
		display: flex;
		margin: 20px 0;
		gap: 10px;
		& img {
			width: 30px;
			height: 30px;
			filter: invert(1);
		}
	}
	button {
		appearance: none;
		background-color: transparent;
		border: solid 1px whitesmoke;
		border-radius: 5px;
		cursor: pointer;
	}
</style>

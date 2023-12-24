import './style.css';
import { UIComponents } from './lib/constants/BasicUIComponents.ts';
import Toolbar from './lib/components/svelte/toolbar/Toolbar.svelte';
import { editor } from './lib/stores/EditorStore.ts';
const appElement = document.querySelector<HTMLDivElement>( '#app' )!;
const editorInstance = editor.get();
editorInstance.attachContentManager( '1', appElement );
new Toolbar( { target: appElement, props: { editor: editor.get() } } );
console.log( editor.get() );
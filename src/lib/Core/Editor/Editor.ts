import { SvelteComponent } from "svelte";
import { Command } from "../Command/Command";
import { ContentManager } from "../ContentManager/ContentManager";
export interface IEditor {
	// addUIComponent: ( name: UIComponentName, component: UIComponent ) => void;
	// getUIComponent: ( name: UIComponentName ) => UIComponent | undefined;
	attachContentManager: ( id: string, editorContainer: HTMLElement ) => void;
}
export type UIComponentName = string;
export type ActionName = string;
export type UIComponent = ( props: Record<string, any> ) => HTMLElement;

export class Editor implements IEditor {

	private availableCommands: Map<string, Command>;
	private UIComponents: Map<UIComponentName, SvelteComponent>;
	private UIContentManager: Map<string, ContentManager>;

	lastFocus: { range: Range, manager: ContentManager; } | null;

	constructor ( commands: Map<string, Command>, UIComponents: Map<UIComponentName, SvelteComponent> ) {
		this.UIComponents = UIComponents;
		this.UIContentManager = new Map();
		this.lastFocus = null;
		this.availableCommands = commands;
	}

	set lastFocusRange ( CaretManagerBounds: { manager: ContentManager, range: Range; } ) {
		this.lastFocus = CaretManagerBounds;
	}

	addUIComponent ( name: string, component: SvelteComponent ) {
		this.UIComponents.set( name, component );
	}
	getAvailableComponentsIterator () {
		return this.UIComponents.keys();
	}
	// getAvailableActionsIterator () {
	// 	return this.actions.keys();
	// }
	getUIComponent ( name: string ) {
		return this.UIComponents.get( name );
	}

	attachContentManager ( id: string, parentElement: HTMLElement ) {
		const manager = new ContentManager( this, parentElement, id, this.availableCommands );
		this.UIContentManager.set( id, manager );
	}
	getContentManager ( id: string ) {
		return this.UIContentManager.get( id );
	}
	executeCommand ( name: string, args?: Record<string, any> ) {
		this.handleFocus();
		this.lastFocus?.manager.commandInvoker.execute( name, { ...this.lastFocus, ...args } );
	}
	private handleFocus () {
		const selection = getSelection();
		selection?.removeAllRanges();
		selection?.addRange( this.lastFocus?.range as Range );
	}
}

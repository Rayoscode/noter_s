import { SvelteComponent } from 'svelte';
import type { Command } from '../Command/Command';
import { ContentManager } from '../ContentManager/ContentManager';
export interface IEditor {
	// addUIComponent: ( name: UIComponentName, component: UIComponent ) => void;
	// getUIComponent: ( name: UIComponentName ) => UIComponent | undefined;
	attachContentManager: (id: string, editorContainer: HTMLElement) => void;
}
export type UIComponentName = string;
export type ActionName = string;

export class Editor implements IEditor {
	private availableCommands: Record<string, Command>;
	private UIComponents: Record<string, SvelteComponent>;
	private UIContentManager: Map<string, ContentManager>;

	lastLayoutFocus: ContentManager | null;

	constructor(
		commands: Record<string, Command>,
		UIComponents: Record<UIComponentName, SvelteComponent>
	) {
		this.UIComponents = UIComponents;
		this.UIContentManager = new Map();
		this.lastLayoutFocus = null;
		this.availableCommands = commands;
	}
	addUIComponent(name: string, component: SvelteComponent) {
		this.UIComponents[name] = component;
	}

	getUIComponent(name: string) {
		return this.UIComponents[name];
	}

	attachContentManager(id: string, parentElement: HTMLElement) {
		const manager = new ContentManager(
			this,
			parentElement,
			// id,
			this.availableCommands
		);
		this.UIContentManager.set(id, manager);
	}
	getContentManager(id: string) {
		return this.UIContentManager.get(id);
	}
	executeCommand(name: string, args?: Record<string, any>) {
		if (args && args.contentManager) {
			args.contentManager.undoManager.do(name, { ...args });
		} else {
			this.lastLayoutFocus?.undoManager.do(name, {
				contentManager: this.lastLayoutFocus,
				range: getSelection()?.getRangeAt(0) as Range,
				...args
			});
		}
	}
}

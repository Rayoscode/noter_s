import type { Editor } from '../Editor/Editor';
import { SvelteComponent } from 'svelte';
import { getComponentContainerOnCaret, getComponentOnCaret } from '../utils/selection';
import type { ComponentNode } from '../ContentManager/ContentManager';
export interface HTMLElementWithNodeData extends HTMLElement {
	node: ComponentNode;
}
export class ComponentManager {
	private editor: Editor;
	private creationPortal: HTMLElement;
	constructor(editor: Editor) {
		this.creationPortal = document.createElement('div');
		this.creationPortal.style.cssText = 'display:none;';
		this.editor = editor;
	}
	createComponent(
		name: string,
		props: Record<string, any>
	): { component: SvelteComponent; element: DocumentFragment } {
		const Component = this.editor.getUIComponent(name) as SvelteComponent;
		let componentInstance;
		if (Component && this.creationPortal.childElementCount === 0) {
			// @ts-expect-error Type Fault
			componentInstance = new Component({
				target: this.creationPortal,
				props: props
			});
		} else {
			throw Error('Error Editor - Cannot create component ');
		}
		const fragment = new DocumentFragment();
		fragment.append(this.creationPortal.firstElementChild as HTMLElement);
		return { component: componentInstance, element: fragment };
	}
	insertComponentBefore(name: string, props: Record<string, any>, element: HTMLElement) {
		const componentBounds = this.createComponent(name, props);
		element.before(componentBounds.element.firstElementChild as HTMLElement);
		return componentBounds;
	}
	insertComponentAfter(name: string, props: Record<string, any>, element: HTMLElement) {
		const componentBounds = this.createComponent(name, props);
		const elementAfter = componentBounds.element.firstElementChild as Element;
		element.after(elementAfter as HTMLElement);
		return {
			component: componentBounds.component,
			element: element.nextElementSibling
		};
	}
	replaceOnCaret(componentName: string, props: Record<string, any>) {
		const element = getComponentOnCaret() as HTMLElementWithNodeData;
		const oldComponentName = element?.className.split(' ')[0];
		const oldComponentProps = element?.node.props ?? {};
		const newComponentBounds = this.createComponent(componentName, props);
		const newElement = newComponentBounds.element.firstChild as HTMLElementWithNodeData;
		element.replaceWith(newElement);
		getSelection()?.setPosition(newElement, 0);
		return { oldComponentName, props: oldComponentProps };
	}
	insertComponentOnCaretAfter(name: string, props: Record<string, any>, focus?: boolean) {
		const componentBounds = this.createComponent(name, props);
		const element = getComponentOnCaret();
		const elementAfter = componentBounds.element.firstElementChild as HTMLElement;
		element?.after(elementAfter);
		if (focus) {
			const selection = getSelection();
			selection?.removeAllRanges();
			selection?.setPosition(elementAfter);
		}
		return { component: componentBounds.component, element: elementAfter };
	}
	insertOnCurrentContainer(
		componentName: string,
		props: Record<string, any>,
		where: 'top' | 'bottom'
	) {
		const componentBounds = this.createComponent(componentName, props);
		const component = componentBounds.element.firstChild as HTMLElementWithNodeData;
		const container = getComponentContainerOnCaret();
		if (where === 'top') {
			container.prepend(component);
		} else if (where === 'bottom') {
			container.append(component);
		}
		return { component };
	}
	insertOnContainer(
		componentName: string,
		props: Record<string, any>,
		where: 'top' | 'bottom',
		container: HTMLElementWithNodeData
	) {
		const componentBounds = this.createComponent(componentName, props);
		const component = componentBounds.element.firstChild as HTMLElementWithNodeData;
		if (where === 'top') {
			container.prepend(component);
		} else if (where === 'bottom') {
			container.append(component);
		}
		return { component };
	}
	replaceComponent(
		newComponentName: string,
		props: any,
		oldComponentRef: HTMLElementWithNodeData,
		persistContents?: boolean
	) {
		const content = new DocumentFragment();
		if (persistContents) {
			for (const nodeChild of oldComponentRef.childNodes) {
				content.append(nodeChild);
			} 
		}
    const component = this.createComponent(newComponentName,{...props,content})
    const element = component.element.firstChild as HTMLElementWithNodeData
    oldComponentRef.replaceWith(component.element)
    return {element}
	}
}

import { Editor } from '../Editor/Editor';
import type { Command } from '../Command/Command';
import { UndoManager } from '../UndoManager/UndoManager';
import { events } from '../BasicEvents/basicEvents';
import { ComponentManager, type HTMLElementWithNodeData } from '../ComponentManager/ComponentManager';
import { EventManager } from '../EventManager/EventManager';
import { getComponentContainerOnCaret, getComponentOnCaret } from '../utils/selection';
import { BeforeInputStatesCallbacks } from '../States/CoreEventStates';
export interface TriggerAction {
	trigger: (args: Record<string, any>) => boolean;
	commandName: string;
}
export interface ContainerNode {
	id: string;
	type: string;
	componentChildren: ComponentNode[];
}
export interface ComponentNode {
	name: string;
	id: string;
	props: Record<string, any>;
	userDataContent?: string | Record<string, any> | undefined;
  ref:HTMLElementWithNodeData
}

export interface ContainerWithNodeData extends HTMLElement{
  node:ContainerNode
}

export class ContentManager {
	private editor: Editor;
	readonly contentContainer: HTMLElement;
	readonly undoManager: UndoManager;
	readonly eventManager: EventManager;
	readonly componentManager: ComponentManager;
	private ast: ContainerNode;

	constructor(editor: Editor, parentElement: HTMLElement, commands: Record<string, Command>) {
		this.editor = editor;
		this.contentContainer = parentElement;
		this.contentContainer.classList.add('component-container');
		this.contentContainer.contentEditable = 'true';
		this.contentContainer.contentManager = this
		this.undoManager = new UndoManager(this.contentContainer, commands);
		this.componentManager = new ComponentManager(editor);
		this.eventManager = new EventManager(events, parentElement, this.editor, this,BeforeInputStatesCallbacks);
		this.ast = { id: crypto.randomUUID(), type: 'lines-container', componentChildren: [] };
		// @ts-expect-error Hay que cambiar por un interface que extienda el HTMLElement con la prop node
		this.contentContainer.node = this.ast;
		if (this.contentContainer.childElementCount === 0) {
			this.insertComponentOnContainer('heading', { level: 1 }, 'top',this.contentContainer);
		}
		this.handleCaretChanges();
		this.contentContainer.addEventListener('focus',() => { 
			this.editor.lastLayoutFocus = this
		 })
	}

	insertComponentOnCaret(componentName: string, props: any, focus: boolean,) {
		const componentOnCaret = getComponentOnCaret() as HTMLElementWithNodeData;
    const componentContainer = getComponentContainerOnCaret() as ContainerWithNodeData
    const idx = componentContainer.node.componentChildren.findIndex((comp)=> comp.id === componentOnCaret.id )
		const  elementComponet = this.componentManager.insertComponentOnCaretAfter(componentName, props, focus).element as HTMLElementWithNodeData;
    const newNode = {id:crypto.randomUUID(),name:componentName,props,ref:elementComponet}
    componentContainer.node.componentChildren.splice(idx,0,newNode)
    elementComponet.node = newNode
    return {node:newNode} 
	}
	insertComponentAfter(componentName:string,props:any,elementAfter:HTMLElementWithNodeData){
		// TODO: Manejo de insetion after element

		const component = this.componentManager.insertComponentAfter(componentName,props,elementAfter)
    const newNode = {id:crypto.randomUUID(),name:componentName,props,ref:component.element}
		component.element.node = newNode
		return {node:newNode}
	}
  
	insertComponentOnContainer(componentName: string, props: any, where: 'top' | 'bottom',container:any) {
		const result = this.componentManager.insertOnContainer(componentName, props, where,container);
    const node = {id:crypto.randomUUID(),name:componentName,props,ref:result.component}
		if (where === 'top') {
    container.node.componentChildren.unshift(node) 
		} else if (where === 'bottom') {
    container.node.componentChildren.push(node) 
		}
    result.component.node = node
		return result
	}

	replaceComponent(newComponentName:string,componentToReplace:HTMLElementWithNodeData,props:any,persistContent?:boolean){
		const nodeRef = componentToReplace.node
		const component = this.componentManager.replaceComponent(newComponentName,props,componentToReplace,persistContent)
		nodeRef.name = newComponentName
		nodeRef.props = props
		nodeRef.ref = component.element as HTMLElementWithNodeData
		component.element.node = nodeRef
		return component.element	
	}
	private handleCaretChanges() {
		let oldRange = new Range();
		let newRange = new Range();
		this.contentContainer.addEventListener('mousedown', () => {
			oldRange = getSelection()?.getRangeAt(0).cloneRange() as Range;
		});
		this.contentContainer.addEventListener('mouseup', () => {
			newRange = getSelection()?.getRangeAt(0).cloneRange() as Range;
			this.undoManager.do('moveCaretCursor', { oldRange, newRange,editor:this.editor,contentManager:this });
		});

		this.contentContainer.addEventListener('keydown', (event) => {
			if (
				event.key === 'ArrowUp' ||
				event.key === 'ArrowDown' ||
				event.key === 'ArrowRight' ||
				event.key === 'ArrowLeft'
			) {
				oldRange = getSelection()?.getRangeAt(0).cloneRange() as Range;
			}
		});
		this.contentContainer.addEventListener('keyup', (event) => {
			if (
				event.key === 'ArrowUp' ||
				event.key === 'ArrowDown' ||
				event.key === 'ArrowRight' ||
				event.key === 'ArrowLeft'
			) {
				newRange = getSelection()?.getRangeAt(0).cloneRange() as Range;
				this.undoManager.do('moveCaretCursor', { oldRange, newRange,editor:this.editor,contentManager:this });
			}
		});
	}
}

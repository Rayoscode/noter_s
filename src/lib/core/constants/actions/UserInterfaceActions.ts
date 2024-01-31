import { ContentManager } from '$lib/core/ContentManager/ContentManager';
import {
	getClosestElementOfNode,
	isAComponent,
	handleSelectionRangeOfEdges,
	isAComponentContainer,
	getComponentOnCaret,
	searchForLastNodeBeforeEndOn,
	searchForFirstNodeAfterStartOn
} from '$lib/core/utils/selection';
export interface MiddlewareAction {
	execute: (args?: any) => any;
	unexecute: (args?: any) => any;
}

const extractContents: MiddlewareAction = {
	execute: (
		range: Range
	): {
		fragment: DocumentFragment;
		textNotSelected?: DocumentFragment;
	} => {
		const startNode = range.startContainer;
		const endNode = range.endContainer;
		const startOffset = range.startOffset;
		const endOffset = range.endOffset;
		let component: Element | null = getClosestElementOfNode(range.startContainer);
		if (startNode === endNode && !isAComponent(range.startContainer)) {
			debugger;
			const fragment = range.extractContents();
			const selection = getSelection() as Selection;
			selection.anchorNode?.parentElement?.normalize();
			if (selection.anchorNode?.textContent?.includes('  ')) {
				const node = selection.anchorNode as Text;
				node.replaceData(selection.anchorOffset, 1, '\u00a0');
			}

			return { fragment: fragment };
		}
		const fragment = new DocumentFragment();
		if (startNode === endNode && isAComponent(range.startContainer)) {
			const elementToFocus = range.startContainer.previousSibling as Element;
			const isTextEditable = elementToFocus.classList.contains('text-editable');
			if (isTextEditable) {
				getSelection()?.selectAllChildren(elementToFocus);
				if (isTextEditable) {
					getSelection()?.collapseToEnd();
				}
			}
			fragment.append(range.startContainer);
			return { fragment };
		}
		if (isAComponent(range.commonAncestorContainer)) {
			return { fragment: range.extractContents() };
		}
		if (startNode instanceof Text) {
			const text = startNode.data;
			startNode.data = text.slice(0, startOffset);
			fragment.append(document.createTextNode(text.slice(startOffset)));
			component = component.nextElementSibling;
		} else {
			const elementToAppendStart = component;
			component = component.nextElementSibling;
			fragment.append(elementToAppendStart);
		}

		while (component && !component.contains(endNode)) {
			const componentToAppend = component;
			component = component.nextElementSibling;
			fragment.append(componentToAppend);
		}
		if (endNode instanceof Text) {
			// const text = endNode.data;
			// endNode.data = text.slice(0, endOffset);
			const selection = getSelection() as Selection;
			selection.setPosition(endNode, endOffset);
			selection.modify('extend', 'forward', 'lineboundary');
			const rangeToRight = selection.getRangeAt(0);
			const elementsNotSelected = rangeToRight.extractContents();
			if (component?.previousElementSibling) {
				selection.setPosition(component.previousElementSibling);
				selection.selectAllChildren(component.previousElementSibling);
				selection.collapseToEnd();
				fragment.append(component as Element);
			}
			return { fragment, textNotSelected: elementsNotSelected };
		} else {
			const elementToFocus = (
				component?.previousSibling ? component.previousSibling : component?.parentElement
			) as Element;
			fragment.append(component as Element);
			if (range.startContainer instanceof Text) {
				if (range.startContainer.data.endsWith(' ')) {
					range.startContainer.replaceData(range.startContainer.length - 1, 1, '\u00a0');
				}
				getSelection()?.setBaseAndExtent(
					range.startContainer,
					range.startContainer.length ?? 0,
					range.startContainer,
					range.startContainer.length ?? 1
				);
			} else {
				const isTextEditable = elementToFocus.classList.contains('text-editable');
				if (isTextEditable) {
					getSelection()?.selectAllChildren(elementToFocus);
					if (isTextEditable) {
						getSelection()?.collapseToEnd();
					}
				}
			}
		}
		return { fragment };
	},
	unexecute: ({
		data
	}: {
		data: { fragment: DocumentFragment; textNotSelected?: DocumentFragment };
	}) => {
		const selection = getSelection() as Selection;
		const range = selection.getRangeAt(0);
		if (data.fragment.childNodes.length === 1 && !isAComponent(data.fragment.firstChild as Node)) {
			const deleted = data.fragment.firstChild;
			const element = range.startContainer as Text;
			const offset = range.endOffset;
			range.insertNode(data.fragment);
			// element.after(data.fragment)
			element.parentElement?.normalize();
			// element.data = element.data.slice(0, offset) + deleted.data + element.data.slice(offset);
			selection.setBaseAndExtent(element, offset, element, offset + deleted.length);
			deleted.remove();

			return;
		} else if (data.fragment.childNodes.length === 1) {
			const component = getComponentOnCaret();
			const elementToAppend = data.fragment.firstChild as Node;
			component.after(elementToAppend);
			selection.selectAllChildren(elementToAppend);
			return;
		}
		const { fragment, textNotSelected } = data;
		let lastElement;
		if (fragment.firstChild instanceof Text) {
			const element = range.startContainer as Text;
			const textElement = fragment.firstChild;
			element.appendData(textElement.data);
			textElement.remove();
			const componentOnCaret = getComponentOnCaret();
			lastElement = fragment.lastElementChild as Element;
			componentOnCaret.after(fragment);
		} else {
			const componentOnCaret = getComponentOnCaret();
			const firstElement = fragment.firstChild as Element;
			lastElement = fragment.lastElementChild as Element;
			componentOnCaret.after(fragment);
			range.setStart(firstElement, 0);
		}

		let offsetEnd = 1;
		if (textNotSelected) {
			// (fragment.lastElementChild?.firstChild as Text).data += textNotSelected
			offsetEnd = lastElement?.lastChild instanceof Text ? lastElement.lastChild.length : 1;
			lastElement.append(textNotSelected);
			lastElement.normalize();
		} else {
			offsetEnd = lastElement?.lastChild instanceof Text ? lastElement.lastChild.length : 1;
		}
		range.setEnd(
			lastElement.lastChild instanceof Text ? lastElement.lastChild : lastElement,
			offsetEnd
		);
	}
};

const insertTextLeftAfterDeleteBackward: MiddlewareAction = {
	execute: ({
		contentManager,
		selection,
		textNotSelected
	}: {
		textNotSelected: DocumentFragment;
		selection: Selection;
		contentManager: ContentManager;
	}) => {
		if (isAComponentContainer(selection.anchorNode as Node)) {
			const elementBounds = contentManager.insertComponentOnContainer(
				'line',
				{ content: textNotSelected },
				'top',
				selection.anchorNode
			);
			getSelection()?.setPosition(elementBounds.component, 0);
		} else if (
			isAComponent(selection.anchorNode as Node) &&
			!(selection.anchorNode as Element).classList.contains('text-editable')
		) {
			const elementBounds = contentManager.insertComponentOnCaret(
				'line',
				{ content: textNotSelected },
				true
			);
			getSelection()?.setPosition(elementBounds.node.ref, 0);
		} else if (selection.anchorNode instanceof Element) {
			// const offset = selection.anchorOffset;
			selection.anchorNode.appendChild(textNotSelected);
			selection.anchorNode.normalize();
			// selection.setPosition(selection.anchorNode, offset);
		} else if (selection.anchorNode instanceof Text) {
			selection.anchorNode.after(textNotSelected);
			selection.anchorNode.normalize();
		}
	},
	unexecute: ({
		data
	}: {
		data: { fragment: DocumentFragment; textNotSelected: DocumentFragment };
	}) => {
		if (data.textNotSelected) {
			const selection = getSelection();
			selection?.modify('extend', 'forward', 'lineboundary');
			const content = selection?.getRangeAt(0).extractContents() as DocumentFragment;
			for (const node of content.childNodes) {
				data.textNotSelected.append(node);
			}
		}
	}
};
const simpleDeleteCharacter: MiddlewareAction = {
	execute() {
		const selection = getSelection();
		if (selection?.anchorOffset !== 0) {
			selection?.modify('extend', 'backward', 'character');
			const character = selection?.toString();
			document.execCommand('delete');
			return character;
		}
		document.execCommand('delete');
	},
	unexecute({ data }) {
		document.execCommand('insertText', false, data);
	}
};
const simpleInsertCharacter: MiddlewareAction = {
	execute(args) {
		document.execCommand('insertText', false, args.data);
	},
	unexecute() {
		document.execCommand('delete');
	}
};
const addToRangeEdgesOfText: MiddlewareAction = {
	execute({ selection, range }: { selection: Selection; range: Range }) {
		handleSelectionRangeOfEdges(range);
		selection.addRange(range);
	},
	unexecute() {
		const selection = getSelection();
		const range = selection?.getRangeAt(0) as Range;
		const startContainer = range.startContainer as HTMLElement;
		const endContainer = range.endContainer as HTMLElement;
		if (startContainer.firstChild instanceof Text) {
			range.setStart(startContainer, 0);
		}
		if (endContainer.lastChild instanceof Text) {
			range.setEnd(endContainer.lastChild, endContainer.lastChild.length);
		}
	}
};

const extractContentToTheRight: MiddlewareAction = {
	execute() {
		// debugger
		const selection = getSelection();
		selection?.modify('extend', 'forward', 'lineboundary');
		if (selection?.toString() === '') {
			return;
		}
		const content = selection?.getRangeAt(0).extractContents();
		return content;
	},
	unexecute() {
		return;
	}
};
const insertNewLine: MiddlewareAction = {
	execute(args: { content: DocumentFragment; contentManager: ContentManager }) {
		const { content, contentManager } = args;
		const node = contentManager.insertComponentOnCaret(
			'line',
			{
				content: content
			},
			true
		).node;
		const previousElement = node.ref.previousElementSibling;
		if (node.ref.textContent?.startsWith(' ')) {
			const firstNode = searchForFirstNodeAfterStartOn(node.ref) as Text;
			firstNode.replaceData(0, 1, '\u00a0');
		}
		if (previousElement?.textContent === '') {
			previousElement.innerHTML = '<br>';
		}
		if (previousElement?.textContent?.endsWith(' ')) {
			const lastNode = searchForLastNodeBeforeEndOn(previousElement) as Text;
			lastNode.replaceData(lastNode.length - 1, 1, '\u00a0');
		}
		return node;
	},
	unexecute(args: {
		data: { fragment: DocumentFragment; textNotSelected: DocumentFragment } | DocumentFragment;
	}) {
		const { data } = args;
		if (data && !(data instanceof DocumentFragment) && data.textNotSelected) {
			const selection = getSelection();
			const component = getComponentOnCaret();
			selection?.modify('extend', 'forward', 'lineboundary');
			const content = selection?.getRangeAt(0).extractContents() as DocumentFragment;
			for (const node of content.childNodes) {
				data.textNotSelected.append(node);
			}
			selection?.setPosition(component.previousElementSibling);
			selection?.modify('move', 'forward', 'lineboundary');
			component.remove();
		} else {
			document.execCommand('delete');
		}
	}
};
export const usertInterfaceActions: Record<string, MiddlewareAction> = {
	insertTextLeftAfterDeleteBackward,
	extractContents,
	simpleDeleteCharacter,
	addToRangeEdgesOfText,
	extractContentToTheRight,
	insertNewLine,
	simpleInsertCharacter
};

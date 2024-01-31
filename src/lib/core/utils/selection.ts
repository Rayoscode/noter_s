import type { ContentManager } from '../ContentManager/ContentManager';

export function getClosestElementOfNode(node: Node) {
	if (node instanceof Element) {
		return node.closest('.component') as Element;
	} else {
		return node.parentElement?.closest('.component') as Element;
	}
}
export function getClosestElementOfCaret(selection: Selection) {
	let node: Node | null | undefined | HTMLElement = selection?.anchorNode;

	while (node?.nodeType !== 1) {
		node = node?.parentElement;
	}
	return node;
}

export function getClosestElementOfCaretByRange(range: Range) {
	let node: Node | null | undefined | HTMLElement = range.startContainer;
	while (node && node?.nodeType !== 1) {
		node = node?.parentElement;
	}
	return node;
}
export function insertElementNodeInCaretPosition(selection: Selection, element: HTMLElement) {
	const range = selection?.getRangeAt(0);
	range?.insertNode(element);
}
export function replaceSelectedNodes(selection: Selection, element: HTMLElement) {
	const range = selection?.getRangeAt(0);
	range?.deleteContents();
	range?.insertNode(element);
}
export function getClosestElementWithSelectorOnCaretPosition(
	selection: Selection,
	selector: string
) {
	const element = getClosestElementOfCaret(selection);
	if (element instanceof HTMLElement) {
		return element.closest(selector);
	}
}

export function getClosestElementWithSelectorOnRange(range: Range, selector: string) {
	const element = getClosestElementOfCaretByRange(range);
	if (element instanceof HTMLElement) {
		return element.closest(selector);
	}
}
export function getClosestComponentByNode(node: Node) {
	if (node instanceof HTMLElement) {
		return node.closest('.component');
	} else {
		return node.parentElement?.closest('.component');
	}
}

export function getComponentOnCaret(customCaretRange?: Range) {
	const range = customCaretRange ?? getCaretRange();
	const component = getClosestElementWithSelectorOnRange(range, '.component');
	if (!component) {
		throw Error('Selection Error - Caret is not over a Component Element');
	}
	return component;
}

export function getCaretRange() {
	if ((getSelection() as Selection).rangeCount > 1) {
		throw Error('Selection Error - More than 1 Range is selected');
	}
	return getSelection()?.getRangeAt(0) as Range;
}
export function getComponentContainerOnCaret() {
	const range = getCaretRange();
	const element = getClosestElementOfCaretByRange(range) as HTMLElement;
	return element.closest('.component-container') as HTMLElement;
}
export function isAComponentContainer(node: Node) {
	return node instanceof Element && node.classList.contains('component-container');
}

export function handleSelectionTextOnInsertParagraph(range: Range):
	| {
			contentDeleted: DocumentFragment;
			contentToInsert: DocumentFragment;
	  }
	| undefined {
	const selection = getSelection() as Selection;
	if (selection?.type === 'Caret') {
		return handleContentToRightAndSelectedExtraction(selection);
	} else {
		if (
			isATextNode(range.commonAncestorContainer) ||
			(isAComponent(range.commonAncestorContainer) &&
				!isAComponentContainer(range.commonAncestorContainer))
		) {
			return handleContentToRightAndSelectedExtraction(selection, range);
		} else if (isAComponentContainer(range.commonAncestorContainer)) {
			// Chequeo si las puntas estan incluidas para extraer tambien los componentes
			handleSelectionRangeOfEdges(range);
			return handleContentToRightAndSelectedExtraction(selection, range);
		}
	}
}

export function handleSelectionRangeOfEdges(range: Range) {
	if (range.startContainer instanceof Text && range.startOffset === 0) {
		range.setStart(range.startContainer.parentElement as Element, 0);
	}
	if (range.endContainer instanceof Text && range.endOffset === range.endContainer.length) {
		range.setEnd(range.endContainer.parentElement as Node, 1);
	}
}

function handleContentToRightAndSelectedExtraction(selection: Selection, rangeSelected?: Range) {
	let selected = new DocumentFragment();
	if (rangeSelected) {
		selected = rangeSelected.extractContents();
	}
	selection.modify('extend', 'forward', 'lineboundary');
	const contentToInsert = selection.getRangeAt(0).extractContents();
	return { contentDeleted: selected, contentToInsert };
}

//
export function isALineComponentOnCaret() {
	return !!getClosestElementWithSelectorOnRange(getSelection()?.getRangeAt(0) as Range, '.line');
}
export function isATextNode(node: Node) {
	return node instanceof Text;
}
export function isAComponent(node: Node) {
	return node instanceof Element && node.classList.contains('component');
}

export function insertTextLeft(
	manager: ContentManager,
	text: Text | undefined,
	selection: Selection
) {
	const elementToAddText = selection.anchorNode as HTMLElement;
	if (text && !elementToAddText.parentElement?.closest('.text-editable')) {
		if(elementToAddText.className && elementToAddText.classList.contains('component-container'))
		manager.insertComponentOnCaret('line', { content: text }, true);
	} else if (text && elementToAddText instanceof Text) {
		elementToAddText.after(text as Text);
	}
}
export function searchForLastNodeBeforeEndOn(node:Node):Node{
	while(node.lastChild){
		node = node.lastChild	
	}
	return node
}
export function searchForFirstNodeAfterStartOn(node:Node):Node{
	while(node.firstChild){
		node = node.firstChild
	}
	return node
}
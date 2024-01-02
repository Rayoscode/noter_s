export function getClosestElementOfCaret(selection: Selection) {
  let node: Node | null | undefined | HTMLElement = selection?.anchorNode;
  while (node?.nodeType !== 1) {
    node = node?.parentElement;
  }
  return node;
}

export function getClosestElementOfCaretByRange(range: Range) {
  let node: Node | null | undefined | HTMLElement = range.startContainer;
  while (node?.nodeType !== 1) {
    node = node?.parentElement;
  }
  return node;
}
export function insertElementNodeInCaretPosition(
  selection: Selection,
  element: HTMLElement
) {
  const range = selection?.getRangeAt(0);
  range?.insertNode(element);
}
export function replaceSelectedNodes(
  selection: Selection,
  element: HTMLElement
) {
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

export function getClosestElementWithSelectorOnRange(
  range: Range,
  selector: string
) {
  const element = getClosestElementOfCaretByRange(range);
  if (element instanceof HTMLElement) {
    return element.closest(selector);
  }
}
export function isALineComponent(range: Range) {
  return !!getClosestElementWithSelectorOnRange(range, ".line");
}

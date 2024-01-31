import { getClosestElementWithSelectorOnRange } from "$lib/core/utils/selection";

export function handleDeleteBackwardItem() {}
export function handleEndList() {}
export function getListItem(element: HTMLElement) {
  return element.closest(".list-item");
}
export function getListItemFromRange(range: Range) {
  return getClosestElementWithSelectorOnRange(range, ".list-item");
}
export function getListParent(itemElement: HTMLElement) {
  return itemElement.closest(".list");
}
export function isFirstList(listElement: HTMLElement) {
  return !!listElement.parentElement?.closest(".list");
}
export function isOnList(range: Range) {
  return !!getClosestElementWithSelectorOnRange(range, ".list");
}

export function extractAllNextSiblingsOf(listItemElement: HTMLElement) {
  const fragmentSiblings = new DocumentFragment();
  let sibling = listItemElement.nextSibling;
  while (sibling) {
    const siblingNodeToAppend = sibling;
    sibling = sibling.nextSibling;
    fragmentSiblings.append(siblingNodeToAppend);
  }
  return fragmentSiblings;
}
export function isAListOnAList(listItemElement: HTMLElement) {
  return (
    listItemElement.parentElement?.className.includes("list") &&
    listItemElement.parentElement?.parentElement?.className.includes("list")
  );
}
export function isAListItemOnCaret(){
  return !!getClosestElementWithSelectorOnRange(getSelection()?.getRangeAt(0) as Range,'.list-item')
}
export function hasTextContentComponentOnCaret(){
  return getSelection()?.getRangeAt(0).startContainer.textContent !== '' 
}
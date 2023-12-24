import { ContentManager } from "../../../../../Core/ContentManager/ContentManager";
import { getClosestElementOfCaretByRange } from "../../../../../Core/utils/selection";
export function handleNextItemFocus ( element: HTMLElement ) {
  try {
    const listItem = getListItem( element ) as HTMLElement;
    if ( !listItem )
      throw Error( 'Focus Next Item Error - Element is not a list item' );
    const nextItem = listItem?.nextElementSibling;
    if ( isTodoList( listItem ) ) {
      getSelection()?.setPosition( nextItem?.lastElementChild?.firstElementChild as Node );
    } else {
      getSelection()?.setPosition( listItem, 0 );
    }
  } catch ( error ) {
    throw error;
  }
}
// Opciones de insercion de item de lista:
// Soy el primer Item 
// Tengo texto y soy un item: Entonces inserto otro item al lado de este con el texto contenido a la derecha
// Se detecta que es insertParagraph en textContent Vacio:
// Se extrae todos los siblings siguientes al elemento sean listas o items
// Se crea una nueva lista del mismo tipo que la del padre. Luego se inserta una nueva linea si es la primera lista,sino se inserta un nuevo item   
export function handleInsertParagraphEventOnListItem ( range: Range, contentManager: ContentManager ) {
  const element = getClosestElementOfCaretByRange( range ) as HTMLElement;
  const listElement = getListItem( element ) as HTMLElement;
  const todo = isTodoList( listElement );
  const selection = getSelection();
  const lineRange = selection?.getRangeAt( 0 );

  if ( todo ) {

  } else {

  }
  if ( isEndList( range, listElement ) ) {
  } else {
    // range.deleteContents()
    // selection?.modify('extend','forward','lineboundary')
    // range.extractContents()

  }
}
function isEndList ( range: Range, listElement: HTMLElement ) {
  return range.startContainer === listElement;
}
export function handleInsertListItem ( actualElement: HTMLElement, contentManager: ContentManager ) {

}
export function handleDeleteBackwardItem ( element: HTMLElement ) {

}
export function handleEndList () {

}
export function getListItem ( element: HTMLElement ) {
  return element.closest( '.list-item' );
}
export function getListParent ( itemElement: HTMLElement ) {
  return itemElement.closest( '.list' );
}
export function isFirstList ( listElement: HTMLElement ) {
  return !!listElement.parentElement?.closest( '.list' );
}
function isTodoList ( itemElement: HTMLElement ) {
  return !!itemElement.parentElement?.className.includes( 'list todo' );
}
// import { List } from "./List";

import { buildComponent } from "../../Core/BaseUIComponent/BaseUIComponent";

// import UIWebComponent from "../../Core/BaseUIComponent/BaseUIComponent"
// export class ListItem extends HTMLLIElement {
//   private html: string;
//   constructor () {
//     super();
//     this.html = '';
//     this.role = 'listitem';
//     const parentList = this.closest( 'list-component' ) as List;
//     console.log( parentList );
//     if ( parentList.type === 'todo' ) {
//       this.contentEditable = 'false';
//       this.html = `<input type='checkbox'><span contenteditable='true'>${ this.innerHTML }</span> `;
//       this.setContent(
//         `${ this.html }`
//       );
//     } else {
//       this.setContent(
//         `${ this.innerHTML }`
//       );
//     }
//     this.render();
//   }
//   protected setContent ( html: string ) {
//     this.html = html;
//   }
//   render () {
//     this.innerHTML = this.html;
//   }
// }
// customElements.define( 'list-item', ListItem, { extends: 'li' } );
interface ListItemProps{
  todo:boolean
}
export function ListItem(props:ListItemProps){
  const element = document.createElement('li')
  element.className = 'list-item component'
  if(props.todo){
    element.contentEditable = 'false'
    element.innerHTML = `<input type='checkbox'><div contenteditable='true'><p class='line'><br></p></div>`
  } else {
    element.innerHTML = '<br>'
  }
  buildComponent(element,props)
  return element
}
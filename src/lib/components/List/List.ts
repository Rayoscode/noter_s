import { buildComponent } from '../../Core/BaseUIComponent/BaseUIComponent';
import { ListItem } from './ListItem';
// import UIWebComponent from "../../Core/BaseUIComponent/BaseUIComponent";
// export class List extends UIWebComponent {
//   constructor () {
//     super();
//     const html = `<${ this.type }>${ this.slot }</${ this.type }>`;
//     this.setContent( html );
//   }
//   get type () {
//     return this.getAttribute( 'type' ) as string ?? 'ul' as string;
//   }
//   set type ( value: 'ul' | 'ol' | 'todo' ) {
//     this.setAttribute( 'type', value );
//   }

//   static get observedAttributes () {
//     return ['type'];
//   }
//   attributeChangedCallback ( attrName, oldValue, newValue ) {
//     if ( attrName.toLowerCase() === 'type' ) {
//       this.setContent( `<${ this.type === 'todo' ? 'ul' : this.type }>${ this.slot }</${ this.type === 'todo' ? 'ul' : this.type }>` );
//       this.render();
//     }
//   }
// }

// customElements.define( 'list-component', List );
interface ListProps {
  type: 'ul' | 'ol' | 'todo';
}
export function List ( props: ListProps ) {
  let tagname = props.type === 'ol' ? 'ol' : 'ul';
  const element = document.createElement( tagname );
  element.className = 'list component';
  element.setAttribute( 'type', props.type );
  const firstItem = ListItem( { todo: props.type === 'todo' } );
  element.appendChild( firstItem );
  buildComponent( element, props );
  return element;
}

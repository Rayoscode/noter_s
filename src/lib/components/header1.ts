import UIWebComponent from "../Core/BaseUIComponent/BaseUIComponent";

export class MainHeader extends UIWebComponent {
  constructor () {
    const html = `<h1 id='test' ref='myElement'><slot>Estoy mostrando algo!</slot></h1>`;
    super(  );
    this.setContent( html );
    this.render();
  }

  static get observedAttributes () {
    return ['color'];
  }
  set color ( value: string ) {
    this.setAttribute( 'color', value );
  }
  get color () {
    return this.getAttribute( 'color' ) ?? '';
  }
  connectedCallback () {
  }
  attributeChangedCallback ( attrName, oldValue, newValue ) {
    console.log( attrName, newValue, oldValue );
    if ( attrName.toLowerCase() === 'color' ) {
      console.log( newValue );
      this.style.color = newValue ?? '';
    }
  }

}
customElements.define( 'main-header', MainHeader );
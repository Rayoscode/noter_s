export default class UIWebComponent extends HTMLElement {
  private html: string;
  slot: string;
  constructor () {
    super();
    this.html = '';
    this.slot = this.innerHTML;
  }
  protected setContent ( html: string ) {
    this.html = html;
  }
  getRefOfComponent ( selector: string ) {
    return this.querySelector( selector );
  }
  render () {
    console.log( this.html );
    this.innerHTML = this.html;
  }
}

export function buildComponent(element:HTMLElement,props:Record<string,any>){
  element.componentProps = {...props,content:''}
}
// customElements.define('main-header',MainHeader)
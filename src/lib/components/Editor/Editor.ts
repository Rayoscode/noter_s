import { ContentManager } from "../../Core/ContentManager/ContentManager";
import defaultStyle from './defaultStyle.css?inline' assert { type: "css" };
import { Editor } from "../../Core/Editor/Editor";

export class EditorComponent extends HTMLElement {
  private template: HTMLTemplateElement;
  readonly editor: Editor;
  readonly manager: ContentManager;
  private notifyLastFocus = ( event: any ) => {
    const selection = this.caretSelection;
    if ( selection && selection.anchorNode ) {
      this.editor.lastFocusRange = { manager: this.manager, range: this.caretRange.cloneRange() };
    }
  };
  constructor ( editor: Editor, manager: ContentManager ) {
    super();
    this.editor = editor;
    this.manager = manager;
    this.template = document.createElement( 'template' );
    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync( defaultStyle );
    this.attachShadow( { mode: 'open' } ).adoptedStyleSheets = [stylesheet];
    this.template.innerHTML = "<div contenteditable='true'></div>";
    this.shadowRoot?.appendChild( this.template.content.cloneNode( true ) );
    // this.shadowRoot
  }
  appendCSS ( css: CSSStyleSheet ) {
    this.shadowRoot?.adoptedStyleSheets.push( css );
  }
  get caretRange () {
    // @ts-ignore
    return this.shadowRoot?.getSelection().getRangeAt( 0 ) as Range;

  }
  get caretSelection () {
    // @ts-ignore
    return this.shadowRoot?.getSelection() as Selection;
  }
  connectedCallback () {
    document.addEventListener( 'selectionchange', this.notifyLastFocus );
  }
  disconnectedCallback () {
    document.removeEventListener( 'selectionchange', this.notifyLastFocus );
  }
}

customElements.define( 'editor-component', EditorComponent );
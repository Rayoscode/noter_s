import { Editor } from "../../Core/Editor/Editor";

export class Toolbar extends HTMLElement{
  private editor:Editor
  constructor(editor:Editor){
    super()
    this.editor = editor
  }
  connectedCallback(){
    this.innerHTML = `
    <ul class='toolbar'>
      <li><button id='bold'><img src='/bold.svg'></button></li>
      <li><button id='italic'><img src='/italic.svg'></button></li>
      <li><button id='underline'><img src='/underline.svg'></button></li>
      <li><button id='ordered-list'><img src='/orderedlist.svg'></button></li>
      <li><button id='unordered-list'><img src='/unorderedlist.svg'></button></li>
      <li><button id='toolbar-list'><img src='/list.svg'></button></li>
      <li><button id='toolbar-h1'><img src='/h1.svg'></button></li>
      <li><button id='toolbar-h2'><img src='/h2.svg'></button></li>
    `
    const boldButton = document.getElementById('bold')
    boldButton?.addEventListener('click',() => { 
      this.handleFocus()
      this.editor.lastFocus?.manager.commandInvoker.execute('formatBold',{...this.editor.lastFocus})
     })
    document.getElementById('italic')?.addEventListener('click',() => { 
      this.handleFocus()
      this.editor.lastFocus?.manager.commandInvoker.execute('formatItalic',{...this.editor.lastFocus})
     })
    document.getElementById('underline')?.addEventListener('click',() => { 
      this.handleFocus()
      this.editor.lastFocus?.manager.commandInvoker.execute('formatUnderline',{...this.editor.lastFocus})
     })
    document.getElementById('ordered-list')?.addEventListener('click',() => { 
      this.handleFocus()
      this.editor.lastFocus?.manager.commandInvoker.execute('insertOrderedList',{...this.editor.lastFocus})
     })
    document.getElementById('unordered-list')?.addEventListener('click',() => { 
      this.handleFocus()
      this.editor.lastFocus?.manager.commandInvoker.execute('insertUnorderedList',{...this.editor.lastFocus})
     })
    document.getElementById('toolbar-h1')?.addEventListener('click',() => { 
      this.handleFocus()
      this.editor.lastFocus?.manager.commandInvoker.execute('insertHeading',{...this.editor.lastFocus,level:'1'})
     })
    document.getElementById('toolbar-h2')?.addEventListener('click',() => { 
      this.handleFocus()
      this.editor.lastFocus?.manager.commandInvoker.execute('insertHeading',{...this.editor.lastFocus,level:'2'})
     })
    document.getElementById('toolbar-list')?.addEventListener('click',() => { 
      this.handleFocus()
      this.editor.lastFocus?.manager.commandInvoker.execute('insertTodoList',{...this.editor.lastFocus})
     })
  }
  handleFocus(){
    const selection = getSelection()
    selection?.removeAllRanges()
    selection?.addRange(this.editor.lastFocus?.range as Range)
  } 
}
customElements.define('editor-toolbar',Toolbar)
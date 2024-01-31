import type { Command } from '$lib/core/Command/Command';
import type { HTMLElementWithNodeData } from '$lib/core/ComponentManager/ComponentManager';
import { ContentManager } from '$lib/core/ContentManager/ContentManager';
import { getComponentOnCaret } from '$lib/core/utils/selection';
import { extractAllNextSiblingsOf,isAListOnAList } from '../ListItem/utils/todo';
export const listCommands: Record<string, Command> = {
  insertOrderedList: {
    execute: (args: { manager: ContentManager }) => {
      const { manager } = args;
      const componentBounds =  manager.insertComponentOnCaret('list', { type: 'ol' }, true);
      componentBounds.node['type']='list'
      componentBounds.node['componentChildren']=[]
      const firstItem = manager.insertComponentOnContainer('list-item',{todo:false},'top',componentBounds.node.ref)
      getSelection()?.setPosition(firstItem.component)
      return {componentBounds}
    },
    unexecute: (args:{manager:ContentManager,componentBounds:{component:any,element:HTMLElement}}) => {
      const {componentBounds} = args
      getSelection()?.setPosition(componentBounds.element,0) 
      getSelection()?.collapseToEnd()
      componentBounds.element.remove()
      
    },
  } as Command,
  insertUnorderedList: {
    execute: (args: { manager: ContentManager }) => {
      const { manager } = args;
      const componentBounds = manager.insertComponentOnCaret('list', { type: 'ul' }, true);
      componentBounds.node['type']='list'
      componentBounds.node['componentChildren']=[]
      const firstItem = manager.insertComponentOnContainer('list-item',{todo:false},'top',componentBounds.node.ref)
      getSelection()?.setPosition(firstItem.component)
      return {componentBounds}
    },
    unexecute: (args:{manager:ContentManager,componentBounds:{component:any,element:HTMLElement}}) => {
      const {componentBounds} = args
      getSelection()?.setPosition(componentBounds.element.previousElementSibling,0) 
      getSelection()?.collapseToEnd()
      componentBounds.element.remove()
      
    },
  } as Command,
  insertTodoList: {
    execute: (args: { manager: ContentManager }) => {
      const { manager } = args;
      const componentBounds = manager.insertComponentOnCaret('list', { type: 'todo' }, true);
      componentBounds.node['type']='list'
      componentBounds.node['componentChildren']=[]
      const firstItem = manager.insertComponentOnContainer('list-item',{todo:true},'top',componentBounds.node.ref)
      getSelection()?.setPosition(firstItem.component)
      return {componentBounds}
    },
    unexecute: (args:{manager:ContentManager,componentBounds:{component:any,element:HTMLElement}}) => {
      const {componentBounds} = args
      getSelection()?.setPosition(componentBounds.element,0) 
      getSelection()?.collapseToEnd()
      componentBounds.element.remove()
      
    },
  } as Command,
  insertListItem: {
    execute: (args: { contentManager: ContentManager; range: Range }) => {
    console.log('insertando list item')
      const { contentManager } = args;
      const ref = getComponentOnCaret() as HTMLElementWithNodeData;
      getSelection()?.modify('extend','forward','lineboundary');
      const content = getSelection()?.getRangeAt(0).extractContents()
      const componentBounds = contentManager.insertComponentAfter(
        'list-item',
        { todo: ref.node.props.todo,content:content },
        ref,
      );
      
      const previousElement = componentBounds.node.ref?.previousElementSibling
      if ( previousElement?.innerHTML === "" ) {
        previousElement.innerHTML = "<br>";
      }
      if (ref.node.props.todo ) {
        getSelection()?.setPosition(
          componentBounds.node.ref?.lastElementChild?.firstElementChild as HTMLElement,
          0,
        );
      } else {
        getSelection()?.setPosition(componentBounds.node.ref, 0);
      }
      return { componentBounds };
    },
    unexecute: (args:{manager:ContentManager,componentBounds:{component:any,element:HTMLElement}}) => {
      const {componentBounds} = args
      getSelection()?.setPosition(componentBounds.element,0) 
      componentBounds.element.remove()
    },
  } as Command,
  endCurrentList: {
    execute: (args: { contentManager: ContentManager; range: Range }) => {
      const { contentManager } = args;
      const ref = getComponentOnCaret() as HTMLElement;
      const siblings: DocumentFragment = extractAllNextSiblingsOf(ref);
      const todo = ref.parentElement?.parentElement?.className.includes('todo') 
      const componentBounds = contentManager.insertComponentAfter(
        isAListOnAList(ref) ? 'list-item' : 'line',
        { todo: todo },
        ref.parentElement as HTMLElementWithNodeData,
      );
      if(todo){
      getSelection()?.setPosition(componentBounds.node.ref?.lastElementChild?.firstElementChild as HTMLElement);
      }else{
      getSelection()?.setPosition(componentBounds.node.ref);
      }
      if (siblings.childElementCount !== 0) {
        const listOfNextSiblings = ref.parentElement?.cloneNode(false);
        listOfNextSiblings?.appendChild(siblings);
        componentBounds.node.ref?.after(listOfNextSiblings as Node);
      }
      ref.remove();
      return { componentBounds };
    },
    unexecute: () => {

    },
  } as Command,
};

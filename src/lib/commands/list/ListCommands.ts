import { Command } from '../../Core/Command/Command';
import { ContentManager } from '../../Core/ContentManager/ContentManager';
import {
  extractAllNextSiblingsOf,
  isAListOnAList,
} from '../../components/svelte/List/ListItem/utils/todo';
export const listCommands: Record<string, Command> = {
  insertOrderedList: {
    execute: (args: { manager: ContentManager }) => {
      const { manager } = args;
      manager.insertComponentOnCaretAfter('list', { type: 'ol', manager }, true);
    },
    unexecute: (args) => {},
  } as Command,
  insertUnorderedList: {
    execute: (args: { manager: ContentManager }) => {
      const { manager } = args;
      manager.insertComponentOnCaretAfter('list', { type: 'ul' }, true);
    },
    unexecute: () => {},
  } as Command,
  insertTodoList: {
    execute: (args: { manager: ContentManager }) => {
      const { manager } = args;

      manager.insertComponentOnCaretAfter('list', { type: 'todo' }, true);
    },
    unexecute: () => {},
  } as Command,
  insertListItem: {
    execute: (args: { contentManager: ContentManager; range: Range }) => {
      const { contentManager } = args;
      const ref = contentManager.getComponentOnCaret() as HTMLElement;
      const componentBounds = contentManager.insertComponentAfter(
        'list-item',
        { type: ref.props.type },
        ref,
      );
      if (ref.props.type === 'todo') {
        contentManager.editorContainer.caretSelection.setPosition(
          componentBounds.element?.lastElementChild?.firstElementChild as HTMLElement,
          0,
        );
      } else {
        contentManager.editorContainer.caretSelection.setPosition(componentBounds.element, 0);
      }
      return { componentBounds };
    },
    unexecute: () => {},
  } as Command,
  endCurrentList: {
    execute: (args: { contentManager: ContentManager; range: Range }) => {
      const { contentManager } = args;
      const ref = contentManager.getComponentOnCaret() as HTMLElement;
      const siblings: DocumentFragment = extractAllNextSiblingsOf(ref);

      const componentBounds = contentManager.insertComponentAfter(
        isAListOnAList(ref) ? 'list-item' : 'line',
        { type: ref.props.type },
        ref.parentElement as HTMLElement,
      );
      getSelection()?.setPosition(componentBounds.element);
      if (siblings.childElementCount !== 0) {
        const listOfNextSiblings = ref.parentElement?.cloneNode(false);
        listOfNextSiblings?.appendChild(siblings);
        componentBounds.element?.after(listOfNextSiblings as Node);
      }
      ref.remove();
      return { componentBounds };
    },
    unexecute: () => {},
  } as Command,
};

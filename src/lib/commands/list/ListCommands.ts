import { Command } from "../../Core/Command/Command";
import { ContentManager } from "../../Core/ContentManager/ContentManager";
import {
  extractAllNextSiblingsOf,
  isAListOnAList,
} from "../../components/svelte/List/ListItem/utils/todo";
export const listCommands: Record<string, Command> = {
  insertOrderedList: {
    execute: (args: { manager: ContentManager }) => {
      const { manager } = args;
      manager.insertComponentOnCaretAfter(
        "list",
        { type: "ol", manager },
        true
      );
    },
    unexecute: (args) => {},
  } as Command,
  insertUnorderedList: {
    execute: (args: { manager: ContentManager }) => {
      const { manager } = args;
      manager.insertComponentOnCaretAfter("list", { type: "ul" }, true);
    },
    unexecute: () => {},
  } as Command,
  insertTodoList: {
    execute: (args: { manager: ContentManager }) => {
      const { manager } = args;

      manager.insertComponentOnCaretAfter("list", { type: "todo" }, true);
    },
    unexecute: () => {},
  } as Command,
  insertListItem: {
    execute: (args: {
      manager: ContentManager;
      range: Range;
      ref: HTMLElement;
    }) => {
      const { ref, manager, range } = args;
      console.log("ref", ref.props);
      const componentBounds = manager.insertComponentAfter(
        "list-item",
        { type: ref.props.type },
        ref
      );
      if (ref.props.type === "todo") {
      } else {
        manager.editorContainer.caretSelection.setPosition(
          componentBounds.element,
          0
        );
      }
      return { componentBounds };
    },
    unexecute: () => {},
  } as Command,
  endCurrentList: {
    execute: (args: {
      manager: ContentManager;
      range: Range;
      ref: HTMLElement;
    }) => {
      const { manager, range, ref } = args;
      const siblings: DocumentFragment = extractAllNextSiblingsOf(ref);
      let componentBounds;
      if (isAListOnAList(ref)) {
        componentBounds = manager.insertComponentAfter(
          "list-item",
          { type: ref.props.type },
          ref.parentElement as HTMLElement
        );
        getSelection()?.setPosition(componentBounds.element);
      } else {
        componentBounds = manager.insertComponentAfter(
          "line",
          { type: ref.props.type },
          ref.parentElement as HTMLElement
        );
        console.log(componentBounds.element);
      }
      const listOfNextSiblings = ref.parentElement?.cloneNode(false);
      listOfNextSiblings?.appendChild(siblings);
      componentBounds.element.after(listOfNextSiblings as Node);
      ref.remove();
      return { componentBounds };
    },
    unexecute: () => {},
  } as Command,
};

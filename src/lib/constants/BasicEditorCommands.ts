import { ContentManager } from "../Core/ContentManager/ContentManager";
import { Editor } from "../Core/Editor/Editor";
import { Command } from "../Core/Command/Command";
export const BasicEditorCommands: Record<string, Command> = {
  insertText: {
    execute: (args: { ev: InputEvent }) => {
      // console.log(args.ev.data)
      document.execCommand("insertText", false, args.ev.data ?? "");
    },
    unexecute: () => {
      document.execCommand("delete");
    },
  } as Command,
  // @ts-ignore
  deleteContentBackward: {
    execute: (args: { ev: InputEvent; range: Range }) => {
      let range = args.ev.getTargetRanges()[0];
      let data = range.startContainer?.textContent[range.startOffset] ?? "";
      document.execCommand("delete");
      return { data };
    },
    unexecute: (args: { range: Range; data: string }) => {
      document.execCommand("insertText", false, args.data ?? "");
    },
  } as Command,
  formatItalic: {
    execute: (args: { ev: InputEvent }) => {
      // console.log( args.ev );
      document.execCommand("italic");
    },
    unexecute: (args: { range: Range }) => {
      document.execCommand("italic");
    },
  } as Command,
  formatBold: {
    execute: () => {
      document.execCommand("bold");
    },
    unexecute: (args: { range: Range }) => {
      const selection = getSelection();
      selection?.removeAllRanges();
      selection?.addRange(args.range);
      document.execCommand("bold");
    },
  } as Command,
  formatUnderline: {
    execute: () => {
      document.execCommand("underline");
    },
    unexecute: (args: { range: Range }) => {
      const selection = getSelection();
      selection?.removeAllRanges();
      selection?.addRange(args.range);
      document.execCommand("underline");
    },
  } as Command,
  moveCaretCursor: {
    execute: (args: {
      ev: MouseEvent;
      contentManager: ContentManager;
      oldRange: Range;
      newRange: Range;
    }) => {
      const { newRange } = args;
      const selection = getSelection();
      selection?.removeAllRanges();
      selection?.addRange(newRange);
    },
    unexecute: (args: { range: Range; oldRange: Range; newRange: Range }) => {
      const { oldRange } = args;
      const selection = getSelection();
      selection?.removeAllRanges();
      selection?.addRange(oldRange);
    },
  } as Command,
  insertParagraph: {
    execute: (args: {
      editor: Editor;
      contentManager: ContentManager;
      ev: InputEvent;
      range: Range;
    }) => {
      const { contentManager } = args;
      const selection = contentManager.editorContainer.caretSelection;
      selection.modify("extend", "forward", "lineboundary");
      const range = contentManager.editorContainer.caretRange;
      contentManager.insertComponentOnCaretAfter(
        "line",
        {
          content:
            selection.toString() === "" ? undefined : range.extractContents(),
        },
        true
      );
      const previousElement =
        contentManager.getComponentOnCaret()?.previousElementSibling;
      if (previousElement?.textContent === "") {
        previousElement.innerHTML = "<br>";
      }
    },
    unexecute: () => {
      document.execCommand("delete");
    },
  } as Command,
  // @ts-ignore
  insertHeading: {
    execute: (args: {
      editor: Editor;
      manager: ContentManager;
      level: string;
    }) => {
      const { manager, level } = args;
      const content = manager.extractContentOfLine();
      const result = manager.replaceComponentOnCaret("heading", {
        level,
        content,
      });
      return result;
    },
    unexecute: (args: {
      manager: ContentManager;
      oldComponentName: string;
      props: Record<string, any>;
    }) => {
      const { manager, props, oldComponentName } = args;
      const content = manager.extractContentOfLine();
      const result = manager.replaceComponentOnCaret(oldComponentName, {
        ...props,
        content,
      });
      return result;
    },
  } as Command,
};

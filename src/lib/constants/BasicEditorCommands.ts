import { ContentManager } from '../Core/ContentManager/ContentManager';
import { Editor } from '../Core/Editor/Editor';
import { Command } from '../Core/Command/Command';
import { getClosestElementWithSelectorOnRange } from '../Core/utils/selection';
import { ListItem } from '../components/List/ListItem';
export const BasicEditorCommands = new Map<string, Command>( [
  [
    'insertText',
    {
      execute: ( args: { ev: InputEvent; } ) => {
        // console.log(args.ev.data)
        document.execCommand( 'insertText', false, args.ev.data ?? '' );
      },
      unexecute: () => {
        document.execCommand( 'delete' );
      },
    } as Command,
  ],

  [
    'deleteContentBackward',
    {
      execute: ( args: { ev: InputEvent; range: Range; } ) => {
        let range = args.ev.getTargetRanges()[0];
        let data = range.startContainer.textContent[range.startOffset] ?? '';
        document.execCommand( 'delete' );
        return { data };
      },
      unexecute: ( args: { range: Range; data: string; } ) => {
        document.execCommand( 'insertText', false, args.data ?? '' );
      },
    } as Command,
  ],
  [
    'formatItalic',
    {
      execute: ( args: { ev: InputEvent; } ) => {
        // console.log( args.ev );
        document.execCommand( 'italic' );
      },
      unexecute: ( args: { range: Range; } ) => {
        document.execCommand( 'italic' );
      },
    } as Command,
  ],
  [
    'formatBold',
    {
      execute: () => {
        document.execCommand( 'bold' );
      },
      unexecute: ( args: { range: Range; } ) => {
        const selection = getSelection();
        selection?.removeAllRanges();
        selection?.addRange( args.range );
        document.execCommand( 'bold' );
      },
    } as Command,
  ],
  [
    'formatUnderline',
    {
      execute: () => {
        document.execCommand( 'underline' );
      },
      unexecute: ( args: { range: Range; } ) => {
        const selection = getSelection();
        selection?.removeAllRanges();
        selection?.addRange( args.range );
        document.execCommand( 'underline' );
      },
    } as Command,
  ],
  [
    'moveCaretCursor',
    {
      execute: ( args: {
        ev: MouseEvent;
        contentManager: ContentManager;
        oldRange: Range;
        newRange: Range;
      } ) => {
        const { newRange } = args;
        const selection = getSelection();
        selection?.removeAllRanges();
        selection?.addRange( newRange );
      },
      unexecute: ( args: { range: Range; oldRange: Range; newRange: Range; } ) => {
        const { oldRange } = args;
        const selection = getSelection();
        selection?.removeAllRanges();
        selection?.addRange( oldRange );
      },
    } as Command,
  ],
  [
    'insertParagraph',
    {
      execute: ( args: {
        editor: Editor;
        contentManager: ContentManager;
        ev: InputEvent;
        range: Range;
      } ) => {
        console.log( 'executing from editor container' );
        const { contentManager, range } = args;
        const isListItem = getClosestElementWithSelectorOnRange( range, '.list-item' );
        if ( isListItem ) {
          isListItem.focus();
          document.execCommand( 'insertParagraph' );
          const range = contentManager.editorContainer.caretRange;
          const element = range.startContainer as HTMLElement;
          console.log( { element } );
          if ( element.nodeName === 'LI' && !element.className.includes( 'list-item' ) ) {

            element.replaceWith( ListItem( { todo: element.parentElement?.getAttribute( 'type' ) === 'todo' } ) );
          }
          if ( element.nodeName === 'DIV' ) {
            console.log( element );
            contentManager.replaceElementForComponent( element, 'line', {}, );
          }
        } else {
          const selection = contentManager.editorContainer.caretSelection;
          selection.modify( 'extend', 'forward', 'lineboundary' );
          const range = contentManager.editorContainer.caretRange;
          contentManager.insertSvelteComponentAfterCaret( 'line', { content: selection.toString() === '' ? undefined : range.extractContents() }, true );
        }
      },
      unexecute: () => {
        document.execCommand( 'delete' );
      },
    } as Command,
  ],
  [
    'insertHeading',
    //@ts-ignore
    {
      execute: ( args: {
        editor: Editor;
        manager: ContentManager;
        level: string;
      } ) => {
        const { manager, level } = args;
        const content = manager.extractContentOfLine();
        const result = manager.replaceComponentOnCaret( 'heading', { level, content } );
        return result;
      },
      unexecute: ( args: { manager: ContentManager, oldComponentName: string, props: Record<string, any>; } ) => {
        const { manager, props, oldComponentName } = args;
        const content = manager.extractContentOfLine();
        const result = manager.replaceComponentOnCaret( oldComponentName, { ...props, content } );
        return result;
      },
    } as Command,
  ],

  [
    'insertOrderedList',
    //@ts-ignore
    {
      execute: ( args: { manager: ContentManager; } ) => {
        const { manager } = args;
        manager.insertSvelteComponentAfterCaret( 'list', { type: 'ol', manager }, true );
      },

      unexecute: ( args: { manager: ContentManager, props: Record<string, any>, content: DocumentFragment, oldComponentName: string; } ) => {
        const { manager, props, oldComponentName } = args;
        const content = manager.extractContentOfLine();
        return manager.replaceComponentOnCaret( oldComponentName, { ...props, content: content } );
      },
    } as Command,
  ],
  [
    'insertUnorderedList',
    //@ts-ignore
    {
      execute: ( args: { manager: ContentManager; } ) => {
        const { manager } = args;
        manager.insertSvelteComponentAfterCaret( 'list', { type: 'ul' }, true );
      },
      unexecute: ( args: { manager: ContentManager, props: Record<string, any>, content: DocumentFragment, oldComponentName: string; } ) => {
        const { manager, props, oldComponentName } = args;
        const content = manager.extractContentOfLine();
        return manager.replaceComponentOnCaret( oldComponentName, { ...props, content: content } );
      },
    } as Command,
  ],
  [
    'insertTodoList',
    //@ts-ignore
    {
      execute: ( args: { manager: ContentManager; editor: Editor; } ) => {
        const { manager } = args;
        manager.insertSvelteComponentAfterCaret( 'list', { type: 'todo' }, true );
      },
      unexecute: ( args: { manager: ContentManager, props: Record<string, any>, content: DocumentFragment, oldComponentName: string; } ) => {
        const { manager, props, oldComponentName } = args;
        const content = manager.extractContentOfLine();
        const result = manager.replaceComponentOnCaret( oldComponentName, { ...props, content: content } );
        return result;
      },
    } as Command,
  ],
] );

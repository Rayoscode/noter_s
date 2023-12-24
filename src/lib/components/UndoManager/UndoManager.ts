import { CommandExecuted } from '../../Core/Command/CommandInvoker';
export class UndoManager {
  private commandStack: CommandExecuted[];
  private redoCommandStack: CommandExecuted[];
  constructor ( editorElement: HTMLElement ) {
    this.redoCommandStack = [];
    this.commandStack = [];
    editorElement.addEventListener( 'keydown', ( event ) => {
      if ( event.ctrlKey && event.key === 'z' ) {
        this.undo();
        event.preventDefault();
      } else if ( event.ctrlKey && event.key === 'y' ) {
        this.redo();
        event.preventDefault();
      }
    } );
  }
  registerExecutedCommand ( commandExecuted: CommandExecuted ) {
    this.commandStack.push( commandExecuted );
  }
  redo () {
    const commandRegistered = this.redoCommandStack.pop() as CommandExecuted;
    // const selection = getSelection();
    // selection?.removeAllRanges();
    // selection?.addRange(commandRegistered.args.range);
    this.recursiveSameCommandRedo( commandRegistered );
  }
  undo () {
    const commandRegistered = this.commandStack.pop() as CommandExecuted;
    // const selection = getSelection();
    // console.log(commandRegistered.args.range)
    // selection?.removeAllRanges();
    // selection?.addRange(commandRegistered.args.range);
    this.recursiveSameCommandUndo( commandRegistered );
  }
  private recursiveSameCommandUndo ( { command, name, args }: CommandExecuted ) {
    if ( this.commandStack.length === 0 || this.commandStack[this.commandStack.length - 1].name !== name ) {
      const result = command.unexecute( args );
      this.redoCommandStack.push( { name, command, args: { ...args, ...result } } );
      return;
    } else {
      const result = command.unexecute( args );
      this.redoCommandStack.push( { name, command, args: { ...args, ...result } } );
      this.recursiveSameCommandUndo( this.commandStack.pop() as CommandExecuted );
    }
  }
  private recursiveSameCommandRedo ( { command, name, args }: CommandExecuted ) {
    if ( this.redoCommandStack.length === 0 || this.redoCommandStack[this.redoCommandStack.length - 1].name !== name ) {
      const result = command.execute( args );
      this.commandStack.push( { name, command, args: { ...args, ...result } } );
      return;
    } else {
      const result = command.execute( args );
      this.commandStack.push( { name, command, args: { ...args, ...result } } );
      this.recursiveSameCommandUndo( this.redoCommandStack.pop() as CommandExecuted );
    }
  }
}

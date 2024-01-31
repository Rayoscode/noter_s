
import type { Command,CommandExecuted } from "../Command/Command";
export class UndoManager {
  private doCommandStack: CommandExecuted[];
  private redoCommandStack: CommandExecuted[];
  private registeredCommands:Record<string,Command>
  constructor ( editorElement: HTMLElement,commands:Record<string,Command> ) {
    this.redoCommandStack = [];
    this.doCommandStack = [];
    this.registeredCommands = commands
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
  do(commandName:string,args:Record<string,any>){
    const command = this.registeredCommands[commandName] as Command
    const result = command.execute(args)
    this.doCommandStack.push({commandName,args:{...args,...result}})
  }
  redo () {
    if(this.redoCommandStack.length === 0){
      return
    }
    const commandRegistered = this.redoCommandStack.pop() as CommandExecuted;
    this.recursiveSameCommandRedo( commandRegistered );
  }
  undo () {
    if(this.doCommandStack.length === 0){
      return
    }
    const commandRegistered = this.doCommandStack.pop() as CommandExecuted;
    this.recursiveSameCommandUndo( commandRegistered );
  }
  private recursiveSameCommandUndo ( { commandName, args }: CommandExecuted ) {
    if ( this.doCommandStack.length === 0 || this.doCommandStack[this.doCommandStack.length - 1].commandName !== commandName ) {
      const result = this.registeredCommands[commandName].unexecute( args );
      this.redoCommandStack.push( {  commandName, args: { ...args, ...result } } );
      return;
    } else {
      const result = this.registeredCommands[commandName].unexecute( args );
      this.redoCommandStack.push( {  commandName, args: { ...args, ...result } } );
      this.recursiveSameCommandUndo( this.doCommandStack.pop() as CommandExecuted );
    }
  }
  private recursiveSameCommandRedo ( { commandName,  args }: CommandExecuted ) {
    if ( this.redoCommandStack.length === 0 || this.redoCommandStack[this.redoCommandStack.length - 1].commandName !== commandName ) {
      const result = this.registeredCommands[commandName].execute( args );
      this.doCommandStack.push( { commandName, args: { ...args, ...result } } );
      return;
    } else {
      const result = this.registeredCommands[commandName].execute( args );
      this.doCommandStack.push( { commandName, args: { ...args, ...result } } );
      this.recursiveSameCommandRedo( this.redoCommandStack.pop() as CommandExecuted );
    }
  }
}

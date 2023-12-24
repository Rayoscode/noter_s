import { UndoManager } from '../../components/UndoManager/UndoManager';
import { Command } from './Command';
export type CommandExecuted = { name: string; command: Command; args: Record<string, any> };
export class CommandInvoker {
  private commands: Map<string, Command>;
  readonly undoManager:UndoManager
  constructor(commands: Map<string, Command>,container:HTMLElement) {
    this.commands = commands;
    this.undoManager = new UndoManager(container)
  }
  registerNewCommand(name: string, command: Command) {
    this.commands.set(name, command);
  }
  execute(name: string, args: Record<string, any>) {
    const command = this.commands.get(name) as Command
    const result = command?.execute(args) 
    this.undoManager.registerExecutedCommand({name,command,args:{...args, ...result}})
  
  }
}

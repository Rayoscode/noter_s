export interface Command {
  execute(args?: any): Record<string, any> | undefined;
  unexecute: (args?: any) => Record<string, any> | undefined;
}
export interface EventCommand extends Command {
  when:(args:Record<string,any>) => boolean
}
export interface CommandExecuted {
  commandName:string,
  args:Record<string,any>
}
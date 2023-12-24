export interface Command {
  execute(args?: Record<string, any>): Record<string, any> | undefined;
  unexecute: (args?: Record<string, any>) => Record<string, any> | undefined;
}

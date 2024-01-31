import type { Command } from "$lib/core/Command/Command";
import { ContentManager } from "$lib/core/ContentManager/ContentManager";

export const codeBlocksCommands = {
  insertCodeblock: {
    execute: ( args: { contentManager: ContentManager; } ) => {
      const { contentManager} = args;
      const componentBounds = contentManager.insertComponentOnCaret( 'code-block', {}, false);
      return {componentBounds}
    },
    unexecute: (args:{manager:ContentManager,componentBounds:{element:HTMLElement,component:any} }) => { 
      const {componentBounds,} = args
      getSelection()?.setPosition(componentBounds.element.previousElementSibling)
      componentBounds.element.remove()

    }
  } as Command,
};
import { isALineComponent } from "../Core/utils/selection";
import { isAListItem,hasTextContent } from "../components/svelte/List/ListItem/utils/todo";
export const trigger: Record<string, any> = {
  beforeinput: [
    {
      name: "textTrigger",
      trigger: ({ ev }: { ev: InputEvent }) => {
        return ev.inputType === "insertText";
      },
      commandName: "insertText",
    },
    {
      name: "boldTrigger",
      trigger: ({ ev }: { ev: InputEvent }) => {
        return ev.inputType === "formatBold";
      },
      commandName: "formatBold",
    },
    {
      name: "italicTrigger",
      trigger: ({ ev }: { ev: InputEvent }) => {
        return ev.inputType === "formatItalic";
      },
      commandName: "formatItalic",
    },
    {
      name: "deleteTrigger",
      trigger: ({ ev }: { ev: InputEvent }) => {
        return ev.inputType === "deleteContentBackward";
      },
      commandName: "deleteContentBackward",
    },
    {
      name: "paragrahInsertionTrigger",
      trigger: ({ ev, range }: { ev: InputEvent; range: Range }) => {
        return ev.inputType === "insertParagraph" && isALineComponent(range);
      },
      commandName: "insertParagraph",
    },
    {
      name:"endList",
      trigger:({ev,range}:{ ev: InputEvent; range: Range }) => { 
        return ev.inputType === 'insertParagraph' && isAListItem(range) && !hasTextContent(range)
       },
       commandName:'endCurrentList'

    },
    {
      name:"listItemInsertion",
      trigger:({ev,range}:{ ev: InputEvent; range: Range }) => { 
        return ev.inputType === 'insertParagraph' && isAListItem(range) && hasTextContent(range)
       },
       commandName:'insertListItem'

    },
    // {
    //   name: "listItemInsertionTrigger",
    //   trigger: ({ ev, range }: { ev: InputEvent; range: Range }) => {
    //     return ev.inputType === "insertParagraph" && isOnList(range);
    //   },
    //   commandName: "insertListItem",
    // },
  ],
};

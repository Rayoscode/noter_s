export interface TriggerEvent {
  commandName:string,
  when:string
}
export type Events = Record<string,TriggerEvent[]>
export const events:Events  = {
  beforeinput: [
    {
      when:'insertionText',
      commandName: "insertText",
    },
    {
      when:'formatBoldTriggered',
      commandName: "formatBold",
    },
    {
      when:'formatItalicTriggered',
      commandName: "formatItalic",
    },
    {
      when:'deletionOfContentBackward',
      commandName: "deleteContentBackward",
    },
    {
      when:'insertionParagraph && isALineComponentOnCaret',
      commandName: "insertParagraph",
    },
    {
      when:"insertionParagraph && isAListItemOnCaret && !hasTextContentComponentOnCaret",
       commandName:'endCurrentList'
    },
    {
       when:"insertionParagraph && isAListItemOnCaret && hasTextContentComponentOnCaret",
       commandName:'insertListItem'
    },
  ],
};
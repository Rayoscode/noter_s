export const trigger: Record<string, any> = {
  beforeinput: [
    {
      trigger: ( { ev }: { ev: InputEvent; } ) => {
        return ev.inputType === 'insertText';
      },
      commandName: 'insertText',
    },
    {
      trigger: ( { ev }: { ev: InputEvent; } ) => {
        return ev.inputType === 'formatBold';
      },
      commandName: 'formatBold',
    },
    {
      trigger: ( { ev }: { ev: InputEvent; } ) => {
        return ev.inputType === 'formatItalic';
      },
      commandName: 'formatItalic',
    },
    {
      trigger: ( { ev }: { ev: InputEvent; } ) => {
        return ev.inputType === 'deleteContentBackward';
      },
      commandName: 'deleteContentBackward',
    },
    {
      trigger: ( { ev }: { ev: InputEvent; } ) => {
        return ev.inputType === 'insertParagraph';
      },
      commandName: 'insertParagraph',
    },
  ],
};

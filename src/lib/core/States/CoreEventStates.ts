import {
	hasTextContentComponentOnCaret,
	isAListItemOnCaret
} from '$lib/components/List/ListItem/utils/todo';
// import type { CallbackCondition } from "../EventManager/EventManager";
import { isALineComponentOnCaret } from '../utils/selection';

export const BeforeInputStatesCallbacks = {
	beforeinput: {
		insertionText: ({ ev }: { ev: InputEvent }) => {
			return ev.inputType === 'insertText';
		},
		formatBoldTriggered: ({ ev }: { ev: InputEvent }) => {
			return ev.inputType === 'formatBold';
		},
		formatItalicTriggered: ({ ev }: { ev: InputEvent }) => {
			return ev.inputType === 'formatItalic';
		},
		formatUnderlineTriggered: ({ ev }: { ev: InputEvent }) => {
			return ev.inputType === 'formatUnderline';
		},
		deletionOfContentBackward: ({ ev }: { ev: InputEvent }) => {
			return ev.inputType === 'deleteContentBackward';
		},
		insertionParagraph: ({ ev }: { ev: InputEvent }) => {
			return ev.inputType === 'insertParagraph';
		},
		isALineComponentOnCaret: () => {
			return isALineComponentOnCaret();
		},
		isAListItemOnCaret: () => {
			return isAListItemOnCaret();
		},
		hasTextContentComponentOnCaret: () => {
			return hasTextContentComponentOnCaret();
		}
	}
};

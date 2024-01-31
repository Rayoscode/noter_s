import { ContentManager } from '../ContentManager/ContentManager';
import { Editor } from '../Editor/Editor';
import type { Command } from '../Command/Command';
import { usertInterfaceActions } from './actions/UserInterfaceActions';
import { getComponentOnCaret, isAComponentContainer } from '../utils/selection';
import type { HTMLElementWithNodeData } from '../ComponentManager/ComponentManager';

export type CommandName = string;

export const BasicEditorCommands: Record<CommandName, Command> = {
	insertText: {
		execute: (args: { ev: InputEvent; contentManager: ContentManager }) => {
			const selection = getSelection();
			const stepActionsExecuted = [];
			if (selection?.type === 'Caret') {
				usertInterfaceActions.simpleInsertCharacter.execute({ data: args.ev.data });
				stepActionsExecuted.push('simpleInsertCharacter');
				return { stepActionsExecuted };
			} else {
				const range = selection?.getRangeAt(0) as Range;
				if (
					isAComponentContainer(range.commonAncestorContainer) ||
					(range.startContainer === range.endContainer &&
						range.endOffset === (range.endContainer as Text).length &&
						range.startOffset === 0)
				) {
					stepActionsExecuted.push('addToRangeEdgesOfText');
					usertInterfaceActions.addToRangeEdgesOfText.execute({ selection, range });
				}
				const { contentManager } = args;
				const data = usertInterfaceActions.extractContents.execute(range);
				stepActionsExecuted.push('extractContents');

				stepActionsExecuted.push('simpleInsertCharacter');
				document.execCommand('insertText', false, args.ev.data ?? '');
				if (data.textNotSelected) {
					stepActionsExecuted.push('insertTextLeftAfterDeleteBackward');
					usertInterfaceActions.insertTextLeftAfterDeleteBackward.execute({
						contentManager,
						selection,
						textNotSelected: data.textNotSelected
					});
				}
				return { data, stepActionsExecuted };
			}
		},
		unexecute: (args) => {
			const { data, stepActionsExecuted } = args;
			for (let i = stepActionsExecuted.length - 1; i >= 0; i--) {
				usertInterfaceActions[stepActionsExecuted[i]].unexecute({ data });
			}
		}
	} as Command,

	deleteContentBackward: {
		execute: (args: { range: Range; contentManager: ContentManager }) => {
			const { contentManager } = args;
			// debugger
			const selection = getSelection() as Selection;
			const stepActionsExecuted: string[] = [];
			const range = selection.getRangeAt(0);
			let data;
			if (selection.type === 'Caret') {
				data = usertInterfaceActions.simpleDeleteCharacter.execute({});
				stepActionsExecuted.push('simpleDeleteCharacter');
				return { data, stepActionsExecuted };
			} else {
				if (
					isAComponentContainer(range.commonAncestorContainer) ||
					(range.startContainer === range.endContainer &&
						range.endOffset === (range.endContainer as Text).length &&
						range.startOffset === 0)
				) {
					stepActionsExecuted.push('addToRangeEdgesOfText');
					usertInterfaceActions.addToRangeEdgesOfText.execute({ selection, range });
				}
				data = usertInterfaceActions.extractContents.execute(range);
				stepActionsExecuted.push('extractContents');
				if (data.textNotSelected) {
					stepActionsExecuted.push('insertTextLeftAfterDeleteBackward');
					usertInterfaceActions.insertTextLeftAfterDeleteBackward.execute({
						contentManager,
						selection,
						textNotSelected: data.textNotSelected
					});
				}
			}
			return { data, stepActionsExecuted };
		},
		unexecute: (args: { data: DocumentFragment | string; stepActionsExecuted: string[] }) => {
			const { data, stepActionsExecuted } = args;
			for (let i = stepActionsExecuted.length - 1; i >= 0; i--) {
				usertInterfaceActions[stepActionsExecuted[i]].unexecute({ data });
			}
			return {};
		}
	},
	formatItalic: {
		execute: () => {
			document.execCommand('italic');
		},
		unexecute: () => {
			document.execCommand('italic');
		}
	} as Command,
	formatBold: {
		execute: () => {
			document.execCommand('bold');
		},
		unexecute: () => {
			document.execCommand('bold');
		}
	} as Command,
	formatUnderline: {
		execute: () => {
			document.execCommand('underline');
		},
		unexecute: () => {
			document.execCommand('underline');
		}
	} as Command,
	moveCaretCursor: {
		execute: (args: { ev: MouseEvent; oldRange: Range; newRange: Range }) => {
			const { newRange } = args;
			const selection = getSelection();
			selection?.removeAllRanges();
			selection?.addRange(newRange);
		},
		unexecute: (args: { range: Range; oldRange: Range; newRange: Range }) => {
			const { oldRange } = args;
			const selection = getSelection();
			selection?.removeAllRanges();
			selection?.addRange(oldRange);
		}
	} as Command,
	insertParagraph: {
		execute: (args: { editor: Editor; contentManager: ContentManager; ev: InputEvent }) => {
			const { contentManager } = args;
			const selection = getSelection() as Selection;
			const range = selection.getRangeAt(0);
			const stepActionsExecuted = [];
			let data;
			if (selection.type === 'Range') {
				if (
					isAComponentContainer(range.commonAncestorContainer) ||
					(range.startContainer === range.endContainer &&
						range.endOffset === (range.endContainer as Text).length &&
						range.startOffset === 0)
				) {
					stepActionsExecuted.push('addToRangeEdgesOfText');
					usertInterfaceActions.addToRangeEdgesOfText.execute({ selection, range });
				}
				data = usertInterfaceActions.extractContents.execute(range);
				stepActionsExecuted.push('extractContents');
				if (selection.anchorNode instanceof Text) {
					stepActionsExecuted.push('extractContentToTheRight');
					data['textNotSelected'] = usertInterfaceActions.extractContentToTheRight.execute();
				}
			} else {
				stepActionsExecuted.push('extractContentToTheRight');
				data = usertInterfaceActions.extractContentToTheRight.execute();
			}
			stepActionsExecuted.push('insertNewLine');
			const node = usertInterfaceActions.insertNewLine.execute({
				content: data && data.textNotSelected !== undefined ? data.textNotSelected : data,
				contentManager
			});
			return { data, ...node, stepActionsExecuted };
		},
		unexecute: (args: {
			data: { fragment: DocumentFragment; textNotSelected: DocumentFragment } | DocumentFragment;
			stepActionsExecuted: string[];
		}) => {
			const { data, stepActionsExecuted } = args;
			for (let i = stepActionsExecuted.length - 1; i >= 0; i--) {
				usertInterfaceActions[stepActionsExecuted[i]].unexecute({ data });
			}
		}
	} as Command,
	insertHeading: {
		// TODO: Make that when is a replace componente,it mantains the node id
		execute: (args: { editor: Editor; contentManager: ContentManager; level: string }) => {
			const { contentManager, level } = args;
			const oldComponent = getComponentOnCaret() as HTMLElementWithNodeData
			if(!oldComponent){
				throw Error ("Error on InsertHeading - There's no component on caret selection")
			}
			const oldComponentNodeName = oldComponent.node.name
			const oldComponentNodeProps = oldComponent.node.props
			const component = contentManager.replaceComponent('heading',oldComponent, {
				level,
			},true);
			getSelection()?.setPosition(component,0)
			return {component,oldComponentNodeName,oldComponentNodeProps};
		},
		unexecute: (args: {
			contentManager: ContentManager;
			oldComponentNodeName:string;
			oldComponentNodeProps: Record<string, any>;
		}) => {
			const { contentManager, oldComponentNodeProps,oldComponentNodeName} = args;
			const componentOnCaret = getComponentOnCaret() as HTMLElementWithNodeData;
			const component = contentManager.replaceComponent(oldComponentNodeName,componentOnCaret,oldComponentNodeProps,true)
			getSelection()?.setPosition(component,0)

		}
	} as Command
};

import { Editor } from "../Core/Editor/Editor";
import { atom } from "nanostores";
import { BasicEditorCommands } from "../constants/BasicEditorCommands";
import { listCommands } from "../commands/list/ListCommands";
import { UIComponents } from "../constants/BasicUIComponents";

export const editor = atom(
  new Editor({ ...BasicEditorCommands, ...listCommands }, UIComponents)
);

import { ActionName, Editor } from '../../Editor/Editor';
import { ContentManager } from '../ContentManager';
export class UserEventsControler {
  private container: HTMLElement;
  private editor: Editor;
  private manager: ContentManager;
  constructor(container: HTMLElement, editor: Editor, manager: ContentManager,eventsTrigger:{type:string,}) {
    this.container = container;
    this.editor = editor;
    this.manager = manager;
  }
  subscribeEventAction(actionName: ActionName,trigger:(event)=>boolean) {

  }

}

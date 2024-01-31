import type { Events } from '../BasicEvents/basicEvents';
import type { ContentManager } from '../ContentManager/ContentManager';
import type { Editor } from '../Editor/Editor';
export type CallbackCondition = (args:any)=>boolean
export class EventManager {
	private events: Events;
	private editor: Editor;
	private contentManager: ContentManager;
	private container: HTMLElement;
  private statesValidators:Record<string,Record<string,CallbackCondition>>
	constructor(
		events: Events,
		element: HTMLElement,
		editor: Editor,
		contentManager: ContentManager,
    statesValidators:any
	) {
		this.events = events;
		this.container = element;
    this.contentManager = contentManager
    this.editor = editor
		this.init();
    this.statesValidators = statesValidators
	}
  // subscribeStatusConditions(newStatesCallbacks:Record<string,CallbackCondition>){
    //TODO: Check for no collapse keys
    // this.statesValidators = {...this.statesValidators,...newStatesCallbacks}
  // }
  subscribeNewEventsTriggers(newEvents:Events){
    this.events = {...this.events,...newEvents}
  }
	private init() {
    for (const event in this.events) {
      this.container.addEventListener(event, (ev) => {
        console.log(ev)
        const range = getSelection()?.getRangeAt(0).cloneRange() as Range
        const stateResult = this.updateStateFromEvent(event,ev,range)
        this.events[event].forEach((triggerEvent) => {          
          if (this.evaluate(stateResult,triggerEvent.when)) {
            this.contentManager.undoManager.do(triggerEvent.commandName, {
              editor:this.editor,
              contentManager:this.contentManager,
              container:this.container,
              ev,
              range,
            });
            if(!ev.defaultPrevented){
              ev.preventDefault();
            }
            return
          }
        });
      });
    }
  }
  private evaluate(state:Record<string,any>, expression:string){
  const fn = new Function(...Object.keys(state),"return " + expression)
  return fn(...Object.values(state))
  }
  private updateStateFromEvent(eventName:string,ev:Event,range:Range){
    const resultState:Record<string,boolean> = {}
    
    const eventStateValidators = this.statesValidators[eventName]
    for(const [state,validateState] of Object.entries(eventStateValidators)){
      resultState[state] = validateState({ev,range})
    }
    return resultState
  }
}

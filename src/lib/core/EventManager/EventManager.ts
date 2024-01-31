import type { Events } from '../BasicEvents/basicEvents';
import type { ContentManager } from '../ContentManager/ContentManager';
import type { Editor } from '../Editor/Editor';
export type CallbackCondition = (args:any)=>boolean
export class EventManager {
	private events: Events;
	private editor: Editor;
	private contentManager: ContentManager;
	private container: HTMLElement;
  private status:Record<string,CallbackCondition>
	constructor(
		events: Events,
		element: HTMLElement,
		editor: Editor,
		contentManager: ContentManager
	) {
		this.events = events;
		this.container = element;
    this.contentManager = contentManager
    this.editor = editor
		this.init();
    this.status = {}
	}
  subscribeStatusConditions(newStatesCallbacks:Record<string,CallbackCondition>){
    //TODO: Check for no collapse keys
    this.status = {...this.status,...newStatesCallbacks}
  }
  subscribeNewEventsTriggers(newEvents:Events){
    this.events = {...this.events,...newEvents}
  }
	private init() {
    for (const event in this.events) {
      this.container.addEventListener(event, (ev) => {
        const range = getSelection()?.getRangeAt(0).cloneRange() as Range 
        this.events[event].forEach((triggerEvent) => {
          
          if (eval(triggerEvent.when)) {
            this.contentManager.undoManager.do(triggerEvent.commandName, {
              editor:this.editor,
              contentManager:this.contentManager,
              container:this.container,
              ev,
              range,
            });
            ev.preventDefault();
            return
          }
        });
      });
    }
  }
  private evaluate(expression:string){

  }
  privateUpdateStates(){

  }
}
// const obj = {
//   val1: true,
//   val2: false,
// };

// // Definimos la variable con la expresión a evaluar
// const expression = "val1 && val2";

// // Creamos una función para evaluar la expresión
// function evaluarExpresion(obj, expression) {
//   // Convertimos la expresión a una función
//   const fn = new Function(...Object.keys(obj), 'return ' + expression);

//   // Reemplazamos los nombres de las variables por sus valores en el objeto
//   return fn(...Object.values(obj));
// }

// // Evaluamos la expresión
// const resultado = evaluarExpresion(obj, expression);
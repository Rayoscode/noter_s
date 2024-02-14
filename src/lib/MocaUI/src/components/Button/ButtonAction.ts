import type { Action } from "svelte/action";
export interface ButtonElementProps{
  events?:Record<keyof HTMLElementEventMap,EventListenerOrEventListenerObject >
  attr?:Record<string,string>
  props?:Record<string,any>
}
const buttonAction:Action<HTMLElement,ButtonElementProps|undefined> = (node,buttonElementProps:ButtonElementProps| undefined)=>{
  if(!buttonElementProps){
    return
  } 
  for(const eventName in buttonElementProps.events){
    node.addEventListener(eventName,buttonElementProps.events[eventName])
  }
  for(const attrName in buttonElementProps.attr){
    node.setAttribute(attrName,buttonElementProps.attr[attrName])
  }
  for(const propName in buttonElementProps.props){
    // @ts-expect-error This is just for test porpouses
    node[propName] = buttonElementProps.props[propName]
  }
  return {
    destroy() {
      for(const eventName in buttonElementProps.events){
      node.removeEventListener(eventName,buttonElementProps.events[eventName])
      }
    },
  }
}
export default buttonAction
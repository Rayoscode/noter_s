import { buildComponent } from "../../Core/BaseUIComponent/BaseUIComponent"
interface LineProps{
  content?:string|DocumentFragment
}
export function Line(props:LineProps){
  const element = document.createElement('p')
  element.className = 'line component'
  if(props.content instanceof DocumentFragment){
    element.appendChild(props.content)
  } else {
    element.innerHTML = props.content ??'<br>'
  }
  buildComponent(element,props)
  return element 
}
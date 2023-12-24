import { buildComponent } from '../../Core/BaseUIComponent/BaseUIComponent';
export function Heading(props: { level: string; content: string | DocumentFragment }) {
  const element = document.createElement('h' + props.level);
  if (props.content instanceof DocumentFragment) {
    props.content.textContent !== ''
      ? element.appendChild(props.content)
      : (element.innerHTML = '<br>');
  } else {
    element.innerHTML = !props.content || props.content === '' ? '<br>' : props.content;
  }
  element.className = 'heading line component';
  buildComponent(element, props);
  return element;
}

import { getClosestElementWithSelectorOnCaretPosition } from "../utils/selection";
import { Editor } from "../Editor/Editor";
import { EditorComponent } from "../../components/Editor/Editor";
import { CommandInvoker } from "../Command/CommandInvoker";
import { Command } from "../Command/Command";
import { trigger } from "../../constants/EventTriggers";
import { SvelteComponent } from "svelte";
export interface TriggerAction {
  trigger: (args: Record<string, any>) => boolean;
  commandName: string;
}

export class ContentManager {
  private editor: Editor;
  readonly editorContainer: EditorComponent;
  private container: HTMLElement;
  private triggerEvents: Record<string, TriggerAction[]> = {};
  private svelteComponentCreationPortal: HTMLDivElement;
  readonly commandInvoker: CommandInvoker;

  constructor(
    editor: Editor,
    parentElement: HTMLElement,
    id: string,
    commands: Record<string, Command>
  ) {
    this.editor = editor;
    const editorContainer = new EditorComponent(editor, this);
    this.editorContainer = editorContainer;
    this.editorContainer.id = id;
    parentElement.appendChild(editorContainer);
    this.container = editorContainer.shadowRoot?.firstChild as HTMLElement;
    this.container.className = "component-container";
    this.triggerEvents = trigger;
    this.handleCaretChanges();
    this.triggerEventHanlder();
    this.svelteComponentCreationPortal = document.createElement("div");
    this.svelteComponentCreationPortal.style.cssText = `display:none;overflow:hidden`;
    this.commandInvoker = new CommandInvoker(commands, this.container);
    if (this.container.childElementCount === 0) {
      this.insertSvelteComponentOn("heading", this.container, { level: 1 });
    }
  }
  createComponent(
    name: string,
    props: Record<string, any>
  ): { component: SvelteComponent; element: DocumentFragment } {
    const Component = this.editor.getUIComponent(name) as SvelteComponent;
    let componentInstance;
    console.log(
      !!Component,
      this.svelteComponentCreationPortal.childElementCount
    );

    if (
      Component &&
      this.svelteComponentCreationPortal.childElementCount === 0
    ) {
      componentInstance = new Component({
        target: this.svelteComponentCreationPortal,
        props: props,
      });
    } else {
      throw Error("Error Editor - Cannot create component ");
    }
    const fragment = new DocumentFragment();
    fragment.append(
      this.svelteComponentCreationPortal.firstElementChild as HTMLElement
    );
    return { component: componentInstance, element: fragment };
  }
  insertComponentBefore(
    name: string,
    props: Record<string, any>,
    element: HTMLElement
  ) {
    const componentBounds = this.createComponent(name, props);
    element.before(componentBounds.element.firstElementChild as HTMLElement);
    return componentBounds;
  }
  insertComponentAfter(
    name: string,
    props: Record<string, any>,
    element: HTMLElement
  ) {
    const componentBounds = this.createComponent(name, props);
    element.after(componentBounds.element.firstElementChild as HTMLElement);
    return {
      component: componentBounds.component,
      element: element.nextElementSibling,
    };
  }
  removeComponent(elementToRemove: HTMLElement) {
    elementToRemove.remove();
  }
  replaceElementForComponent(
    elementToReplace: HTMLElement,
    componentName: string,
    props: Record<string, unknown>
  ) {
    const result = this.insertSvelteComponentOn(
      componentName,
      this.svelteComponentCreationPortal,
      props
    );
    elementToReplace?.replaceWith(
      this.svelteComponentCreationPortal.firstElementChild as Node
    );
    return result;
  }
  replaceComponentOnCaret(componentName: string, props: Record<string, any>) {
    const element = this.getComponentOnCaret() as HTMLElement;
    // const content = element?.textContent;
    const oldComponentName = element?.className.split(" ")[0];
    const oldComponentProps = element?.props ?? {};
    this.replaceElementForComponent(element, componentName, props);
    return { oldComponentName, props: oldComponentProps };
  }
  insertComponentOnCaretAfter(
    name: string,
    props: Record<string, any>,
    focus?: boolean
  ) {
    const componentBounds = this.createComponent(name, props);
    const element = this.getComponentOnCaret();
    const elementAfter = componentBounds.element
      .firstElementChild as HTMLElement;
    element?.after(elementAfter);
    if (focus) {
      const selection = getSelection();
      selection?.removeAllRanges();
      selection?.setPosition(elementAfter);
    }
    return { component: componentBounds.component, element: elementAfter };
  }
  getComponentOnCaret() {
    return getClosestElementWithSelectorOnCaretPosition(
      this.editorContainer.caretSelection,
      ".component"
    );
  }
  getLineContainerOnCaret() {
    return getClosestElementWithSelectorOnCaretPosition(
      this.editorContainer.caretSelection,
      ".component-container"
    );
  }
  extractContentOfLine() {
    const lineElement = getClosestElementWithSelectorOnCaretPosition(
      this.editorContainer.caretSelection,
      ".line"
    ) as Node;
    const fragment = new DocumentFragment();
    fragment.append(...lineElement.childNodes);
    return fragment;
  }
  insertInlineElementInCaretPosition(
    elementName: string,
    className: string,
    content: HTMLElement | Node | undefined
  ) {
    const element = document?.createElement(elementName);
    if (content) {
      content.appendChild(content);
    }
    element.className = className;
    const caretRange = getSelection()?.getRangeAt(0);
    caretRange?.insertNode(element);
  }

  private insertSvelteComponentOn(
    componentName: string,
    parentElement: HTMLElement,
    props: Record<string, any>,
    anchor?: HTMLElement
  ) {
    const Component = this.editor.getUIComponent(
      componentName
    ) as SvelteComponent;
    console.log(componentName);
    const svelteComponentInstance = new Component({
      target: parentElement,
      props,
      anchor,
    });
    return { svelteComponentInstance };
  }
  triggerEventHanlder() {
    const editor = this.editor;
    const contentManager = this;
    const editorContainer = this.editorContainer;
    for (let event in this.triggerEvents) {
      this.container.addEventListener(event, (ev) => {
        this.triggerEvents[event].forEach((triggerEvent) => {
          if (
            triggerEvent.trigger({
              ev,
              editor,
              contentManager,
              editorContainer,
              range: this.editorContainer.caretRange.cloneRange(),
            })
          ) {
            this.commandInvoker.execute(triggerEvent.commandName, {
              editor,
              contentManager,
              editorContainer,
              ev,
              range: this.editorContainer.caretRange.cloneRange(),
            });
            ev.preventDefault();
          }
        });
      });
    }
  }
  addEventListenerToContainer(
    event: keyof HTMLElementEventMap,
    callback: (event: KeyboardEvent | MouseEvent | InputEvent) => void
  ) {
    this.container.addEventListener(event, callback as any);
  }
  removeEventListenerToContainer(
    event: keyof HTMLElementEventMap,
    callback: (event: KeyboardEvent | MouseEvent | InputEvent) => void
  ) {
    this.container.removeEventListener(event, callback as any);
  }
  private handleCaretChanges() {
    let oldRange = new Range();
    let newRange = new Range();
    this.container.addEventListener("mousedown", () => {
      oldRange = this.editorContainer.caretRange.cloneRange();
    });
    this.container.addEventListener("mouseup", () => {
      newRange = this.editorContainer.caretRange.cloneRange();
      this.commandInvoker.execute("moveCaretCursor", { oldRange, newRange });
    });

    this.container.addEventListener("keydown", (event) => {
      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowLeft"
      ) {
        oldRange = this.editorContainer.caretRange.cloneRange();
      }
    });
    this.container.addEventListener("keyup", (event) => {
      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowLeft"
      ) {
        newRange = this.editorContainer.caretRange.cloneRange();
        this.commandInvoker.execute("moveCaretCursor", { oldRange, newRange });
      }
    });
  }
}

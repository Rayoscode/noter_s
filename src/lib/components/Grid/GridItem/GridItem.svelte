<script>
  import { onMount } from "svelte";
  import { spring } from "svelte/motion";
  export let draggable = false;
  export let gridColStart = 0;
  export let gridColEnd = 0;
  export let gridRowStart = 0;
  export let gridRowEnd = 0;
  export let bgOnCollision = false;
  export let zIndex = 10;
  export let style = "";
  let dragged = false;
  /** @type {HTMLElement} */
  let componentRef;
  let position = spring({ x: 0, y: 0 }, { damping: 1 });
  let styleMoving = "";
  let collisionOnEndDraggingEvent = false;
  let originalPosition = { x: 0, y: 0 };
  let collisionMatrix = undefined;

  function debounce(func, delay) {
    let timeoutId;

    return function (...args) {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  /** @type {(elementBoundsDragged:DOMRect,elementBoundsStatic:DOMRect)=> boolean} */
  function validateHorizontalBounds(elementBoundsDragged, elementBoundsStatic) {
    return (
      (elementBoundsDragged.right > elementBoundsStatic.left &&
        elementBoundsDragged.right <= elementBoundsStatic.right) ||
      (elementBoundsDragged.left > elementBoundsStatic.left &&
        elementBoundsDragged.left <= elementBoundsStatic.right)
    );
  }
  /** @type {(elementBoundsDragged:DOMRect,elementBoundsStatic:DOMRect)=> boolean} */
  function validateVerticalBoundsBounds(
    elementBoundsDragged,
    elementBoundsStatic
  ) {
    return (
      (elementBoundsStatic.top <= elementBoundsDragged.top &&
        elementBoundsDragged.top <= elementBoundsStatic.bottom) ||
      (elementBoundsDragged.bottom < elementBoundsStatic.bottom &&
        elementBoundsDragged.bottom > elementBoundsStatic.top)
    );
  }

  const debouncendCheckingColliders = debounce(checkForColliders, 10);

  function checkForColliders() {
    const elementBounds = componentRef.getBoundingClientRect();

    if (componentRef.parentElement) {
      for (const children of componentRef.parentElement.children) {
        const childBounds = children.getBoundingClientRect();

        if (
          children !== componentRef &&
          validateVerticalBoundsBounds(elementBounds, childBounds) &&
          validateHorizontalBounds(elementBounds, childBounds)
        ) {
          children.dataset.collision = "true";
        } else {
          delete children.dataset.collision;
        }
      }
    }
  }

  onMount(() => {
    const rect = componentRef.getBoundingClientRect();
    position.set({
      y: parseInt(rect.y.toFixed()),
      x: parseInt(rect.x.toFixed()),
    });
    collisionMatrix = new Array();
  });

  /** @type {(event:MouseEvent)=>void} */
  function onMouseDownDrag(event) {
    if (draggable) {
      const rect = componentRef.getBoundingClientRect();
      originalPosition.y = parseInt(rect.y.toFixed());
      originalPosition.x = parseInt(rect.x.toFixed());
      dragged = true;
      event.view?.window.addEventListener("mousemove", onMouseMove);
      event.view?.window.addEventListener("mouseup", onEndDrag);
      event.stopPropagation();
    }
  }
  /** @type {(event:MouseEvent)=>void} */
  function onMouseMove(event) {
    position.set(
      {
        y: $position.y + event.movementY,
        x: $position.x + event.movementX,
      },
      { hard: true }
    );
    if (bgOnCollision) {
      debouncendCheckingColliders();
    }
  }
  /** @type {(event:MouseEvent)=>void} */
  function onEndDrag(event) {
    if (!componentRef.parentElement) return;
    event.view?.window.removeEventListener("mousemove", onMouseMove);
    event.view?.window.removeEventListener("mouseup", onEndDrag);

    for (const child of componentRef.parentElement.children) {
      if (child.dataset.collision && child.dataset.collision === true) {
        delete child.dataset.collision;
      } else {
        delete child.dataset.collision;
      }
    }

    if (!collisionOnEndDraggingEvent) {
      position.set(originalPosition).then(() => {
        dragged = false;
      });
    }
  }
</script>

<div
  style="grid-column-start: {gridColStart}; grid-column-end:{gridColEnd}; grid-row-start:{gridRowStart}; grid-row-end:{gridRowEnd}; top:{$position.y}px ; left:{$position.x}px; z-index:{zIndex} ;  position:{dragged
    ? 'absolute'
    : 'static'}; {style} "
  on:mousedown={onMouseDownDrag}
  role="none"
  bind:this={componentRef}
>
  <slot />
</div>

<style>
</style>

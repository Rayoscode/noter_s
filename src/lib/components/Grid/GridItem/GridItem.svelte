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
  let dragged = false;
  /** @type {HTMLDivElement} */
  let componentRef;
  let position = spring({ x: 0, y: 0 }, { damping: 1 });
  let styleMoving = "";
  let collisionOnEndDraggingEvent = false;
  let originalPosition = { x: 0, y: 0 };

  function debounce(func, delay) {
    let timeoutId;

    return function (...args) {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  const debouncendCheckingColliders = debounce(checkForColliders, 100);

  function checkForColliders() {
    const elementBounds = componentRef.getBoundingClientRect();
    const componentOffSetTop = elementBounds.height + elementBounds.bottom;
    const componentOffsetBottom = elementBounds.height + elementBounds.top;
    const componentOffSetRight = elementBounds.left + elementBounds.width;
    const componentOffSetLeft = elementBounds.right + elementBounds.width;
    if (componentRef.parentElement) {
      for (const children of componentRef.parentElement.children) {
        const childBounds = children.getBoundingClientRect();
        const gridComponentOffsetBottom = childBounds.height + childBounds.top;
        const gridComponentOffsetTop = childBounds.height + childBounds.bottom;
        const gridComponentOffsetRight = childBounds.width + childBounds.left;
        const gridComponentOffsetLeft = childBounds.width + childBounds.right;
        console.log();
        if (
          componentRef !== children &&
          ((componentOffSetTop <= gridComponentOffsetTop &&
            componentOffSetTop >= gridComponentOffsetBottom &&
            componentOffSetLeft < gridComponentOffsetRight &&
            componentOffSetLeft > gridComponentOffsetLeft) ||
            (componentOffsetBottom < gridComponentOffsetTop &&
              componentOffsetBottom > gridComponentOffsetBottom &&
              ((componentOffSetLeft < gridComponentOffsetRight &&
                componentOffSetLeft > gridComponentOffsetLeft) ||
                (componentOffSetRight < gridComponentOffsetRight &&
                  componentOffSetRight > gridComponentOffsetLeft))))
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
    event.view?.window.removeEventListener("mousemove", onMouseMove);
    event.view?.window.removeEventListener("mouseup", onEndDrag);
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
    : 'static'} "
  on:mousedown={onMouseDownDrag}
  role="none"
  bind:this={componentRef}
>
  <slot />
</div>

<style>
</style>

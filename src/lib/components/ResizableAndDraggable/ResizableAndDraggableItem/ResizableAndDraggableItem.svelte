<script>
  import { onMount } from "svelte";
  // TODO: complete edge resizes and test bottom resized
  // props
  // ---
  // /** @type { { width:number,height:number} }*/
  // export let size;
  /** @type { { x:number,y:number} }*/
  export let position = { x: 0, y: 0 };
  /** @type {((event:MouseEvent)=>void ) | null}*/
  export let onHorizontalResize = null;
  /** @type {((event:MouseEvent)=>void ) | null}*/
  export let onVerticalResize = null;
  export let resizableEdges = false;
  export let resizableHorizontal = false;
  export let resizableVertical = false;
  export let resizableLeft = false;
  export let resizableRight = false;
  export let resizableTop = false;
  export let resizableBottom = false;
  export let draggable = false;
  export let initialWidth = 0;
  export let initialHeight = 0;
  // export let resizableEdgeTopRight = false;
  // export let resizableEdgeTopLeft = false;
  // export let resizableEdgeBottomRight = false;
  // export let resizableEdgeBottomLeft = false;
  // ---
  let minWidth = 150;
  let minHeight = 50;
  let width = initialWidth;
  let height = initialHeight;
  let maxHeight = 0;
  let maxWidth = 0;
  /** @type { HTMLDivElement }*/
  let containerRef;
  let mousePressed = false;

  onMount(() => {
    if (containerRef.parentElement) {
      maxHeight = containerRef.parentElement?.clientHeight;
      maxWidth = containerRef.parentElement?.clientWidth;
    }
    if (height + position.y >= maxHeight) {
      position.y -= height + position.y - maxHeight;
    }
    addEventListener("resize", checkBounds);
    return () => {
      removeEventListener("resize", checkBounds);
    };
  });

  function checkBounds() {
    if (containerRef.parentElement) {
      maxHeight = containerRef.parentElement.clientHeight;
      maxWidth = containerRef.parentElement.clientWidth;
    }
    console.log("position.x + width", position.x + width);
    console.log("maxWidth", maxWidth);
  }

  /** @type {(event:MouseEvent)=>void}*/
  function onRightResize(event) {
    if (
      (event.view &&
        (position.x + width + 10 > event.view?.innerWidth ||
          width >= maxWidth) &&
        event.movementX > 0) ||
      (minWidth >= width && event.movementX < 0)
    ) {
      event.preventDefault();
      return;
    }
    if (onHorizontalResize) {
      onHorizontalResize(event);
    }
    width += event.movementX;
  }
  /** @type {(event:MouseEvent)=>void}*/
  function onLeftResize(event) {
    if (
      (width >= maxWidth && event.movementX < 0) ||
      (minWidth >= width && event.movementX > 0)
    ) {
      event.preventDefault();
      return;
    }
    if (onHorizontalResize) {
      onHorizontalResize(event);
    }

    position.x += event.movementX;
    width -= event.movementX;
  }
  // TODO: complete function for top resize
  /** @type {(event:MouseEvent)=>void}*/
  function onTopResize(event) {}
  /** @type {(event:MouseEvent)=>void}*/
  function onBottomResize(event) {
    if (
      (event.view &&
        (height >= maxHeight || height >= event.view?.window.innerHeight / 2) &&
        event.movementY > 0) ||
      (minHeight >= height && event.movementY < 0)
    ) {
      event.preventDefault();
      return;
    }
    if (onVerticalResize) {
      onVerticalResize(event);
    }
    height += event.movementY;
  }
  /** @type {(event:MouseEvent)=>void}*/
  function onMoveComponent(event) {
    position.x += event.movementX;
    position.y += event.movementY;
  }
  /** @type {(event:MouseEvent)=>void}*/
  function onMoveEnd(event) {
    if (mousePressed) {
      event.view?.window.removeEventListener("mousemove", onMoveComponent);
      event.view?.window.removeEventListener("mouseup", onMoveEnd);
    }
  }

  /** @type {(event:MouseEvent)=>void}*/
  function onResizeEnd(event) {
    if (mousePressed) {
      if (resizableRight || resizableHorizontal)
        event.view?.removeEventListener("mousemove", onRightResize);
      if (resizableLeft || resizableHorizontal)
        event.view?.removeEventListener("mousemove", onLeftResize);
      if (resizableTop || resizableVertical)
        event.view?.removeEventListener("mousemove", onTopResize);
      if (resizableBottom || resizableVertical)
        event.view?.removeEventListener("mousemove", onBottomResize);
      mousePressed = false;
      event.view?.removeEventListener("mouseup", onResizeEnd);
    }
  }

  /** @type {(event:MouseEvent)=>void}*/
  function onMouseDownResizeRight(event) {
    mousePressed = true;
    event.view?.window.addEventListener("mousemove", onRightResize);
    event.view?.addEventListener("mouseup", onResizeEnd);
    event.preventDefault();
  }
  /** @type {(event:MouseEvent)=>void}*/
  function onMouseDownResizeLeft(event) {
    mousePressed = true;
    event.view?.window.addEventListener("mousemove", onLeftResize);
    event.view?.addEventListener("mouseup", onResizeEnd);
    event.preventDefault();
  }

  /** @type {(event:MouseEvent)=>void}*/
  function onMouseDownResizeTop(event) {
    mousePressed = true;
    event.view?.window.addEventListener("mousemove", onTopResize);
    event.view?.addEventListener("mouseup", onResizeEnd);
    event.preventDefault();
  }
  /** @type {(event:MouseEvent)=>void}*/
  function onMouseDownResizeBottom(event) {
    mousePressed = true;
    event.view?.window.addEventListener("mousemove", onBottomResize);
    event.view?.addEventListener("mouseup", onResizeEnd);
    event.preventDefault();
  }
  /** @type {(event:MouseEvent)=>void}*/
  function onMouseDownMoving(event) {
    if (!draggable) return;
    mousePressed = true;
    event.view?.window.addEventListener("mousemove", onMoveComponent);
    event.view?.window.addEventListener("mouseup", onMoveEnd);
  }
</script>

<div
  bind:this={containerRef}
  role="none"
  class="resizable-container"
  style="width:{width !== 0 ? width + 'px' : 'inherit'};height:{height !== 0
    ? height + 'px'
    : 'auto'} ; top:{position.y}px; left:{position.x}px"
>
  <div>
    {#if resizableVertical || resizableTop}
      <div
        role="none"
        on:mousedown={onMouseDownResizeTop}
        class="resizable-top"
      />
    {/if}
    {#if resizableBottom || resizableVertical}
      <div
        role="none"
        on:mousedown={onMouseDownResizeBottom}
        class="resizable-bottom"
        style="top:{height ? height - 12 + 'px' : '0'};"
      />
    {/if}
    {#if resizableHorizontal || resizableLeft}
      <div
        on:mousedown={onMouseDownResizeLeft}
        role="none"
        class="resizable-left"
      />
    {/if}
    {#if resizableHorizontal || resizableRight}
      <div
        on:mousedown={onMouseDownResizeRight}
        role="none"
        style="left: {width ? width - 8 + 'px' : 'auto'}"
        class="resizable-right"
      />
    {/if}
    <div
      style="width:{width !== 0 ? width + 'px' : 'inherit'};height:{height !== 0
        ? height + 'px'
        : 'auto'}; {draggable
        ? 'border: solid 5px transparent; cursor:move;'
        : ''};"
      role="none"
      on:mousedown={onMouseDownMoving}
      class="draggable-container"
    >
      <slot />
    </div>
  </div>

  <!-- 
  {#if resizableEdges}
    <div
      draggable="false"

      on:mousemove={onEdgeResize}
      class="resizable-left-diagonal"
    />
    <div
      draggable="false"
      on:copy={() => {
        return false;
      }}
      on:mousemove={onEdgeResize}
      class="resizable-right-diagonal"
    />
  {/if} -->
</div>

<style lang="scss">
  .draggable-container {
    width: inherit;
    max-width: 100vw;
    height: inherit;
    > * {
      cursor: auto;
    }
  }
  .resizable-container {
    position: absolute;
    top: 0;
    width: 50%;
    height: inherit;
    left: 0;
    > div {
      position: relative;
    }
  }
  .resizable-right {
    cursor: e-resize;
    background: transparent;
    z-index: 10;
    height: 100%;
    width: 10px;
    position: absolute;
    top: 0;
    left: 0px;
  }
  .resizable-left {
    background: transparent;
    z-index: 10;
    cursor: e-resize;
    height: 100%;
    width: 10px;
    position: absolute;
    top: 0;
    left: 0px;
  }
  .resizable-left-diagonal {
    width: 10px;
    height: 10px;
    cursor: ne-resize;
    position: absolute;
    top: 0;
    left: 0;
  }
  .resizable-top {
    background: red;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 10px;
    cursor: n-resize;
    z-index: 10;
  }
  .resizable-bottom {
    background: transparent;
    width: 100%;
    height: 10px;
    position: absolute;
    top: 0;
    left: 0;
    cursor: n-resize;
    z-index: 10;
  }
  .resizable-right-diagonal {
    cursor: ns-resize;
    z-index: -1;
  }
</style>

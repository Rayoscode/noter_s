<script>
  import { onMount } from "svelte";
  // props
  // ---
  /** @type { { width:number,height:number} }*/
  export let size;
  /** @type { { x:number,y:number} }*/
  export let position;
  export let resizableEdges = false;
  export let resizableHorizontal = true;
  export let resizableVertical = false;
  // export let maxHeight = 100;
  export let maxWidth = 800;
  export let resizableLeft = true;
  export let resizableRight = true;
  export let resizableTop = false;
  export let resizableBottom = false;
  // export let resizableEdgeTopRight = false;
  // export let resizableEdgeTopLeft = false;
  // export let resizableEdgeBottomRight = false;
  // export let resizableEdgeBottomLeft = false;
  // ---
  let minWidth = 150;
  let mousePressed = false;

  /** @type {(event:MouseEvent)=>void}*/
  function onRightResize(event) {
    if (
      ((position.x + size.width + 10 > event.view?.innerWidth ||
        size.width >= maxWidth) &&
        event.movementX > 0) ||
      (minWidth >= size.width && event.movementX < 0)
    ) {
      event.preventDefault();
      return;
    }
    size.width += event.movementX;
  }
  /** @type {(event:MouseEvent)=>void}*/
  function onLeftResize(event) {
    if (
      (size.width >= maxWidth && event.movementX < 0) ||
      (minWidth >= size.width && event.movementX > 0)
    ) {
      event.preventDefault();
      return;
    }
    position.x += event.movementX;
    size.width -= event.movementX;
  }
  /** @type {(event:MouseEvent)=>void}*/
  function onTopResize(event) {}
  /** @type {(event:MouseEvent)=>void}*/
  function onBottomResize() {}

  /** @type {(event:MouseEvent)=>void}*/
  function onResizeEnd(event) {
    if (mousePressed) {
      console.log(event);
      if (resizableRight || resizableHorizontal)
        event.view?.removeEventListener("mousemove", onRightResize);
      if (resizableLeft || resizableHorizontal)
        event.view?.removeEventListener("mousemove", onLeftResize);
      if (resizableTop || resizableVertical)
        event.view?.removeEventListener("mousemove", onTopResize);
      if (resizableBottom || resizableVertical)
        event.view?.removeEventListener("mousemove", onLeftResize);

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
</script>

<div
  class="resizable-container"
  style="width:{size.width}px; height:{size.height}px ;top:{position.y}px; left:{position.x}px"
>
  <div>
    {#if resizableVertical || resizableTop}
      <div role="none" class="resizable-top"></div>
    {/if}
    {#if resizableBottom || resizableVertical}
      <div role="none" class="resizable-bottom" ></div>

    {/if}
    {#if resizableHorizontal || resizableLeft}
      <div
        on:mousedown={onMouseDownResizeLeft}
        role="none"
        class="resizable-left"
      ></div>
    {/if}
    {#if resizableHorizontal || resizableRight}
      <div
        on:mousedown={onMouseDownResizeRight}
        role="none"
        style="left: {size.width - 8}px"
        class="resizable-right"
      ></div>
    {/if}
    <slot />
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
  .resizable-container {
    position: absolute;
    top: 0;
    width: inherit;
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
    background: red;
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

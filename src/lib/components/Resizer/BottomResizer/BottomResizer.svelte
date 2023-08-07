<script>
  /** @type {(value:number)=>void}*/
  export let onChangeHeight;
  export let height = 0;
  /** @type {number | undefined}*/
  export let positionY = undefined;
  export let resizeLeft = true;
  /** @type {((value?:number)=>void) | undefined}*/
  export let setPositionY = undefined;
  let maxHeight = 1000;
  let minHeight = 60;
  let mousePressed = false;
  /** @type {(event:MouseEvent)=>void}*/
  function onMouseDownResizeBottom(event) {
    mousePressed = true;
    event.view?.window.addEventListener("mousemove", onBottomResize);
    event.view?.addEventListener("mouseup", onResizeEnd);
    event.preventDefault();
  }

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

    height += event.movementY;
    onChangeHeight(height);
    if (positionY && setPositionY) {
      setPositionY();
    }
  }
  /** @type {(event:MouseEvent)=>void}*/
  function onResizeEnd(event) {
    if (mousePressed) {
      event.view?.removeEventListener("mousemove", onBottomResize);
      mousePressed = false;
      event.view?.removeEventListener("mouseup", onResizeEnd);
    }
  }
</script>

{#if resizeLeft}
  <div
    on:mousedown={onMouseDownResizeBottom}
    role="none"
    style="top:{positionY ? positionY - 5 : height - 5}px;"
  />
{/if}

<style>
  div {
    z-index: 90;
    cursor: ns-resize;
    height: 10px;
    position: absolute;
    top: 0;
    left: 0;
    width: inherit;
  }
</style>

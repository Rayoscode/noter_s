<script>
  /** @type {(value:number)=>void}*/
  export let onChangeHeight;
  export let height = 0;
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

<div
  on:mousedown={onMouseDownResizeBottom}
  role="none"
  style="top:{height - 5}px;"
/>

<style>
  div {
    z-index: 10;
    cursor: ns-resize;
    height: 10px;
    position: absolute;
    top: 0;
    left: 0;
    width: inherit;
  }
</style>

<script>
  /**
   @type {number}*/
 export let width;
  /**
   @type {number}*/
  export let height;
 export let resizableEdges = false;
 export let onHorizontalResize;
 export let onVerticalResize;
 export let onEdgeResize;
 export let resizableHorizontal = true;
 export let resizableVertical = false;
 let mousePressed = false;
  window.removeEventListener()
</script>

<div class="resizable-container">
  {#if resizableVertical }
    <div draggable="false"  on:mousemove={onVerticalResize} class="resizable-top"></div>
    <div draggable="false"  on:mousemove={onVerticalResize} class="resizable-bottom"></div>

  {/if}
  {#if resizableHorizontal }
    <div draggable="false"
         on:drag={(event)=>{event.stopImmediatePropagation(); event.preventDefault(); return false;}}
         on:mousemove={onHorizontalResize}

         class="resizable-left">
    </div>
    <div draggable="false"
         on:drag={(event)=>{event.stopImmediatePropagation(); event.preventDefault(); return false;}}
         on:mousemove={onHorizontalResize}
         on:mouseup={()=>{mousePressed=false}}
         on:mousedown={()=>{mousePressed = true}}

         style="left: {width-8}px"
         class="resizable-right">
    </div>
  {/if}

  {#if resizableEdges }
    <div draggable="false" on:copy={()=>{return false}} on:mousemove={onEdgeResize} class="resizable-left-diagonal"></div>
    <div  draggable="false" on:copy={()=>{return false}} on:mousemove={onEdgeResize} class="resizable-right-diagonal"  ></div>
  {/if}
  <slot></slot>

</div>

<style lang="scss">
  .resizable-container{
    position: relative;
    top: 0;
    width: inherit;
    height: inherit;
    left: 0;

  }
  .resizable-right{
    cursor: e-resize;
    background: red;

    height: 100%;
    width: 20px;
    position: absolute;
    top: 0;
    left: 0px;
  }
  .resizable-left{
    background: red;

    cursor: e-resize;
    height: 100%;
    width: 8px;
    position: absolute;
    top: 0;
    left: 1px;
  }
  .resizable-left-diagonal{
    width: 10px;
    height: 10px;
    cursor: ne-resize;
    position: absolute;
    top: 0;
    left: 0;

  }
  .resizable-top{
    background: red;
    position: absolute;
    top:0;
    left: 0;
    width: 100%;
    height: 8px;
    cursor: n-resize;
    z-index: -1;

  }
  .resizable-bottom{
    background: red;
    width: 100%;
    height: 8px;
    position: absolute;
    top:0;
    left: 0;
    cursor: n-resize;
    z-index: -1;

  }
  .resizable-right-diagonal{
    cursor: ns-resize;
    z-index: -1;

  }
</style>
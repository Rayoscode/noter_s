<script>
  // TODO: Quitar Resizer de este componente y ponerlo como un child mas del grid. A este componente tambien se tiene que quitar la prop unChageHeight ya que no se encarga de cambiar la altura ya
  import BottomResizer from "$lib/components/Resizer/BottomResizer/BottomResizer.svelte";
  import { onMount } from "svelte";
  export let height = 0;
  /** @type {(value:number)=>void}*/
  export let onChangeHeight = () => {};
  export let backgroundUrl = "";
  export let backgroundPosition = "center";
  /** @type {HTMLDivElement}*/
  let containerRef;
  let positionY = 0;
  onMount(() => {
    positionY = containerRef.clientHeight;
  });

  function setPositionY() {
    positionY = containerRef.clientHeight;
  }
</script>

<div class="background-header" bind:this={containerRef}>
  {#if backgroundUrl !== ""}
    <div
      style="background: {backgroundUrl};
height:inherit;
background-position:{backgroundPosition};
background-size:cover"
    />
    <BottomResizer {height} {positionY} {setPositionY} {onChangeHeight} />
  {/if}
</div>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>

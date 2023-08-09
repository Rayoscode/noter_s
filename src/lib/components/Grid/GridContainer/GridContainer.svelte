<script>
  export let gridTemplateColumnsValue = "auto";
  export let gridTemplateRowsValue = "auto";
  export let rowLength = 0;
  export let colLength = 0;
  /** @type {any }*/
</script>

<div
  style="grid-template-columns: {gridTemplateColumnsValue}; grid-template-rows:{gridTemplateRowsValue};"
  class="grid-container"
>
  {#each Array(rowLength) as row, i}
    {#each Array(colLength) as col, j}
      <div
        style="grid-row-start:{i + 1}; grid-row-end:{i +
          2};grid-column-start:{j + 1};grid-column-end:{j + 2}"
        data-row-index={i}
        data-column-index={j}
      />
    {/each}
  {/each}
  <slot />
</div>

<style>
  .grid-container {
    display: grid;
    width: inherit;
    height: inherit;
    isolation: isolate;
  }

  .grid-container > div {
    border-radius: 8px;
    transition: all 0.3s ease-in-out;
    z-index: 10;
    margin: 1px;
  }
  .grid-container:first-child [data-collision="true"] {
    background-color: unset;
  }
</style>

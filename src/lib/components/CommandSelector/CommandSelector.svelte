<script>
  /** @type {string[]}  */
  export let commands;
  /** @type {(event:Event)=>void}  */
  export let onSelectCommand;
  /** @type {{ x:number,y:number} }  */
  export let position;
</script>

<div style="top:{position.y}px; left:{position.x}px">
  <ul>
    {#each commands as command}
      <li><button on:click={onSelectCommand}>{command}</button></li>
    {/each}
  </ul>
</div>

<style lang="scss">
  div {
    position: absolute;
    top: 0;
    left: 0;
    min-width: 200px;
    overflow-y: auto;
    border: solid 2px black;
    background-color: #212121;
    display: flex;
    flex-direction: column;
    li {
      width: 100%;
      list-style: none;

      button {
        padding: 5px 5px;
        margin: 5px 0px;
        appearance: none;
        border: none;
        background: transparent;
        color: white;
      }
      &:first-child > button {
        margin-top: 0;
      }
      &:last-child > button {
        margin-bottom: 0;
      }
    }
  }
</style>

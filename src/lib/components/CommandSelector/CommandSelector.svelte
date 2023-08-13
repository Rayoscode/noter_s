<script>
  import { onMount, afterUpdate } from "svelte";
  import { fade, fly } from "svelte/transition";
  /** @type {object[]}  */
  export let commands;
  /** @type {(event:Event)=>void}  */
  export let onSelectCommand;
  /** @type {{ x:number,y:number} }  */
  export let position;
  export let showCommandSelector = false;
  let displayCommmandsSelector = false;
  let selected = 1;
  /** @type {HTMLDivElement}*/
  onMount(() => {
    document.documentElement.style.setProperty(
      "--selector-top",
      `${position.x}px`
    );
    document.documentElement.style.setProperty(
      "--selector-left",
      `${position.y}px`
    );
  });

  afterUpdate(() => {
    new Promise((resolve) => {
      document.documentElement.style.setProperty(
        "--selector-top",
        `${position.y}px`
      );
      document.documentElement.style.setProperty(
        "--selector-left",
        `${position.x}px`
      );
      resolve({});
    }).then(() => {
      if (showCommandSelector) {
        displayCommmandsSelector = true;
      } else {
        displayCommmandsSelector = false;
      }
    });
  });
</script>

{#if displayCommmandsSelector}
  <div in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
    <ul>
      {#each commands as command}
        <li in:fly={{ duration: 200 }} out:fly={{ duration: 200 }}>
          <button on:click={onSelectCommand}>{command.description}</button>
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style lang="scss">
  :root {
    --selector-top: 0;
    --selector-left: 0;
    // --selector-opacity: 0;
  }
  div {
    position: absolute;
    top: var(--selector-top);
    left: var(--selector-left);
    min-width: 200px;
    height: auto;
    overflow-y: auto;
    border: var(--floating-componen-border);
    background-color: var(--floating-component-bg-color);
    border-radius: var(--floating-component-rounded);
    color: var(--floating-component-color);
    backdrop-filter: var(--floating-component-bkd-blur);
    display: flex;
    flex-direction: column;
    // opacity: var(--selector-opacity);
    transition: all 0.3s ease-out;
    li {
      width: 100%;
      list-style: none;
      &:hover {
        // filter: brightness(1.2);
        opacity: 0.5;
      }

      button {
        padding: 5px 5px;
        font-size: 1rem;
        margin: 8px 10px;
        appearance: none;
        border: none;
        background: transparent;
        color: white;
      }
      &:first-child > button {
        margin-top: 5px;
      }
      &:last-child > button {
        margin-bottom: 5px;
      }
    }
  }
</style>

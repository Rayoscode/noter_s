<script>
  import { onMount, afterUpdate } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { Command } from "$lib/drivers/Entities/Command/Command";
  /** @type {Command[]}  */
  export let commands;
  /** @type {(selected:string | undefined)=>void}  */
  export let onSelectCommand;
  /** @type {{ x:number,y:number} }  */
  export let position;
  export let showCommandSelector = false;
  let displayCommmandsSelector = false;
  /** @type {string | undefined}*/
  export let selected;
  /** @type {(newSelected:string | undefined)=>void} */
  export let changeSelected;
  /** @type {(value:boolean)=>void}*/
  export let changeShowCommandSelector;
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
  /** @type {(event:KeyboardEvent)=>void} */
  function onKeyDownHandle(event) {
    console.log(event.key);
    if (event.key === "ArrowDown") {
      if (event.target.parentElement.nextSibling) {
        event.target.parentElement.nextSibling.firstChild?.focus();
      } else {
        event.target.parentElement.parentElement.firstChild?.firstChild?.focus();
      }
    }
    if (event.key === "ArrowUp") {
      if (event.target?.parentElement.previousSibling) {
        event.target.parentElement.previousSibling.firstChild?.focus();
      } else {
        changeSelected(undefined);
      }
    }
    if (event.key === "Enter") {
      onSelectCommand(selected);
      changeShowCommandSelector(false);
    }
    if (event.key === "Escape") {
      onSelectCommand(undefined);
      changeShowCommandSelector(false);
    }
  }
</script>

{#if displayCommmandsSelector}
  <div in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
    <ul>
      {#each commands as command, index}
        <li
          id={command.id}
          in:fly={{ duration: 200 }}
          out:fly={{ duration: 200 }}
        >
          <button
            on:focus={() => {
              changeSelected(command.id);
            }}
            on:keydown={onKeyDownHandle}
            role=""
            on:click={() => {
              selected = command.id;
              onSelectCommand(selected);
            }}>{command.name}</button
          >
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
    min-height: 150px;
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
        &:focus {
          outline: none;
          border: none;
          opacity: 0.5;
        }
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

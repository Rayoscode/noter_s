<script>
  import { onMount } from "svelte";
  import { handleEndList, handleInsertListItem } from "./utils/todo";
  import { editor } from "../../../../stores/EditorStore";
  export let type;
  let ref;
  let textContent;
  onMount(() => {
    ref.props = type;
  });
  /** @type {(ev:InputEvent)=>void}*/
  function input(ev) {
    if (ev.inputType === "insertParagraph") {
      if (textContent === "") {
        editor.get().executeCommand("insertParagraph", { type: "todo", ref });
        // console.log(ref.closest("editor-component"));
        // const manager = editor.get().lastFocus.manager;
        // handleEndList()
      } else {
        // handleInsertListItem()
      }
    }
    if (ev.inputType === "deleteContentBackward" && textContent === "") {
    }
  }
</script>

{#if type === "todo"}
  <li bind:this={ref} class="list-item line component" contenteditable="false">
    <input type="checkbox" />
    <div on:beforeinput={input}>
      <span contenteditable="true" bind:textContent>{@html "<br>"}</span>
    </div>
  </li>
{:else}
  <li bind:this={ref} class="list-item line component">
    {@html "<br>"}
  </li>
{/if}

<style>
  li {
    background-color: red;
  }
  .list-item {
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    & div {
      width: 100%;
    }
  }
</style>

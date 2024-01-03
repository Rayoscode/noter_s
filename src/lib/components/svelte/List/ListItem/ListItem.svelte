<script>
  import { onMount } from 'svelte';
  import { handleEndList, handleInsertListItem } from './utils/todo';
  export let type;
  let ref;
  let textContent;
  onMount(() => {
    ref.props = { type };
  });
  /** @type {(ev:InputEvent) => void} */
  function input(ev) {}
</script>

{#if type === 'todo'}
  <li
    bind:this={ref}
    class="list-item component"
    contenteditable="false"
  >
    <input type="checkbox" />
    <div>
      <span
        contenteditable="true"
        bind:textContent
      >
        {@html '<br>'}
      </span>
    </div>
  </li>
{:else}
  <li
    bind:this={ref}
    class="list-item component"
  >
    {@html '<br>'}
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

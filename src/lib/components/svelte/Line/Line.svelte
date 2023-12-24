<script>
  import { onMount } from "svelte";

  /**
   * @type {DocumentFragement | string} content
   */
  export let content;

  /**
   * @type {HTMLElement} lineRef
   */
  let lineRef;
  onMount(() => {
    if (content) {
      lineRef.append(content);
    } else {
      lineRef.innerHTML = "<br>";
    }
  });
</script>

<p class="line component" bind:this={lineRef}></p>

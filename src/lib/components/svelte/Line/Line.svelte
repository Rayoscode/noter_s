<script>
  import { onMount } from "svelte";

  /** @type { DocumentFragment | string } content */
  export let content;

  /**
   * @type {HTMLElement} lineRef
   */
  let lineRef;
  onMount(() => {
    if (content && content.hasChildNodes()) {
      lineRef.append(content);
    } else {
      lineRef.innerHTML = "<br>";
    }
  });
</script>

<p class="line component" bind:this={lineRef}></p>

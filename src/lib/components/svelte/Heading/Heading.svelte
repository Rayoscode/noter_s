<script>
  import { onMount } from "svelte";
  /**
   * @type {1 | 2 | 3 | 4 | 5 | 6} content
   */
  export let level = 1;
  /**
   * @type {DocumentFragement | string} content
   */
  export let content;

  /**
   * @type {HTMLElement} lineRef
   */
  let lineRef;
  onMount(() => {
    lineRef.props = { level };
    if (content) {
      lineRef.append(content);
    } else {
      lineRef.innerHTML = "<br>";
    }
  });
</script>

<svelte:element
  this={`h${level}`}
  class="heading line component"
  bind:this={lineRef}
></svelte:element>

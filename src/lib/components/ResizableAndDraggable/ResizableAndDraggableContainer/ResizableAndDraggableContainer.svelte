<script>
  export let width = "";
  export let height = "";
</script>

<div style="width:{width}; height:{height}">
  <slot />
</div>

<style>
  div {
    position: relative;
  }
</style>

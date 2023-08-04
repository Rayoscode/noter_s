<script>
  export let initialHeight = 0;
  export let backgroundUrl = "";
  export let backgroundPosition = "center";
</script>

<div class="background-header" style=" height:inherit">
  {#if backgroundUrl !== ""}
    <div
      style="background: {backgroundUrl};
height:inherit;
background-position:{backgroundPosition};
background-size:cover"
    />
  {/if}
</div>

<style>
  div {
    width: 100%;
  }
</style>

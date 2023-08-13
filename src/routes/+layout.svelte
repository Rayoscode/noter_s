<script lang="ts">
  import "$lib/styles/global.css";
  import { onMount } from "svelte";
</script>

<slot />

<style>
  @import url("https://fonts.googleapis.com/css2?family=Noto+Sans&family=Noto+Sans+Display&display=swap");
  :global(*) {
    font-family: "Noto Sans", sans-serif;
    font-family: "Noto Sans Display", sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: content-box;
  }
</style>

<script>
  import { fade } from "svelte/transition";
  import BannerEditOptions from "$lib/components/Banner/BannerEditOptions/BannerEditOptions.svelte";
  let bannerOptionsVisible = false;
  export let title = "";
</script>

<div
  on:mouseenter={() => {
    bannerOptionsVisible = true;
  }}
  on:mouseleave={() => {
    bannerOptionsVisible = false;
  }}
  role="banner"
  class="title-banner"
>
  <div>
    {#if bannerOptionsVisible}
      <div
        role="none"
        in:fade={{ duration: 200, delay: 100 }}
        out:fade={{ duration: 200, delay: 100 }}
        class="option-banner-container"
      >
        <BannerEditOptions />
      </div>
    {/if}
    <div class="title-container">
      <input type="text" value={title} />
    </div>
  </div>
</div>

<style lang="scss">
  .title-container {
    display: flex;
    flex-direction: row;

    input {
      appearance: none;
      background-color: transparent;
      outline: none;
      font-size: x-large;
      margin: 15px 10px 15px 10px;
      width: 100%;
      border: none;
      caret-color: white;
      color: white;
      &:focus {
        outline: none;
      }
    }
  }
  .title-banner {
    border-radius: 8px;
    background: rgba(98, 98, 98, 0.4);
    backdrop-filter: blur(4.5px);
    width: 300px;
    height: 60px;
    transition: all 0.5s ease-out;

    display: inline-block;
    > div {
      position: relative;
      .option-banner-container {
        width: 90%;
        cursor: default;
        position: absolute;
        overflow: hidden;
        padding-top: 10px;
        top: 55px;
        left: 0;
        color: white;
      }
    }
  }
</style>

<script>
  import BannerBackground from "$lib/components/Banner/BannerBackground/BannerBackground.svelte";
  import { fade } from "svelte/transition";
  import BannerEditOptions from "$lib/components/Banner/BannerEditOptions/BannerEditOptions.svelte";
  import BottomResizer from "$lib/components/Resizer/BottomResizer/BottomResizer.svelte";
  //  Mock Data
  let headerData = {
    projectName: "Proyectos 1",
    iconUrl: "",
    imageCSSProps: {
      backgroundUrl: "url(https://wallpaperaccess.com/full/3497712.jpg)",
      backgroundPosition: "center",
    },
    initialHeight: 300,
  };
  let headerHeight = headerData.initialHeight;
  let bannerOptionsVisible = false;
  /** @type {(value:number)=>void}*/
  const changeHeaderHeight = (value) => {
    headerHeight = value;
  };
  // TODO: Cropping operation for bg img with background-position
</script>

<header style="height: {headerHeight}px;">
  <BannerBackground
    initialHeight={headerData.initialHeight}
    backgroundPosition={headerData.imageCSSProps.backgroundUrl}
    backgroundUrl={headerData.imageCSSProps.backgroundUrl}
  />
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
        <input type="text" value={headerData.projectName} />
      </div>
    </div>
  </div>
  <BottomResizer height={300} onChangeHeight={changeHeaderHeight} />
</header>

<style lang="scss">
  header {
    width: 100%;
    display: grid;
    grid-template-rows: repeat(4, 1fr);
    grid-template-columns: repeat(3, 1fr);

    height: auto;
    position: relative;
  }
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
    width: 100%;
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

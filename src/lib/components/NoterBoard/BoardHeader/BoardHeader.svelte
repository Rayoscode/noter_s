<script>
  import { fade } from "svelte/transition";
  import BannerEditOptions from "$lib/components/NoterBoard/BoardHeader/BannerEditOptions/BannerEditOptions.svelte";
  import Resizable from "$lib/components/Resizable.svelte";
  //  Mock Data
  let headerData = {
    projectName: "Proyectos 1",
    iconUrl: "",
    imageCSSProps: {
      backgroundUrl: "url(https://wallpaperaccess.com/full/3497712.jpg)",
      backgroundPosition: "center",
    },
    positionXBanner: "60",
    positionYBanner: "60",
    headerHeight: 300,
    headerMinHeight: 200,
  };
  // TODO: Cropping operation for bg img with background-position

  let bannerSizes = { height: 150, width: 400 };
  let bannerOptionsVisible = false;
  console.log("bannerSizes", bannerSizes);
</script>

<header>
  <div
    class="background-header"
    style="min-height: {headerData.headerMinHeight}px; height:{headerData.headerHeight}px;"
  >
    {#if headerData.imageCSSProps.backgroundUrl !== ""}
      <!--      <img on:error={errorImageHandle} src={headerData.backgroundImage} style="height:{headerData.headerHeight}px" alt="Header Background Image"/>-->
      <div
        style="background: {headerData.imageCSSProps.backgroundUrl};
    height:{headerData.headerHeight}px;
    background-position:{headerData.imageCSSProps.backgroundPosition};
    background-size:cover"
      />
    {/if}
  </div>

  <Resizable
    size={bannerSizes}
    position={{ x: 60, y: 60 }}
    resizableHorizontal={true}
  >
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
  </Resizable>
</header>

<style lang="scss">
  header {
    width: 100%;
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
    display: inline-block;
    > div {
      position: relative;
      .option-banner-container {
        width: 90%;
        position: absolute;
        overflow: hidden;
        padding-top: 10px;
        top: 55px;
        left: 0;
        color: white;
      }
    }
  }
  .background-header {
    width: 100%;
    max-height: 700px;
    > div {
      width: 100%;
    }
  }
</style>

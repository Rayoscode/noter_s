<script>
  import BannerBackground from "$lib/components/Banner/BannerBackground/BannerBackground.svelte";
  import { fade } from "svelte/transition";
  import BannerEditOptions from "$lib/components/Banner/BannerEditOptions/BannerEditOptions.svelte";
  import GridContainer from "$lib/components/Grid/GridContainer/GridContainer.svelte";
  import GridItem from "$lib/components/Grid/GridItem/GridItem.svelte";
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
  <GridContainer
    gridTemplateColumnsValue={"repeat(4, 1fr)"}
    gridTemplateRowsValue={"repeat(5, 1fr)"}
    rowLength={5}
    colLength={4}
  >
    <GridItem
      draggable={false}
      gridColStart={1}
      gridColEnd={5}
      gridRowStart={1}
      gridRowEnd={5}
      zIndex={9}
    >
      <BannerBackground
        height={headerData.initialHeight}
        onChangeHeight={changeHeaderHeight}
        backgroundPosition={headerData.imageCSSProps.backgroundUrl}
        backgroundUrl={headerData.imageCSSProps.backgroundUrl}
      />
    </GridItem>
    <GridItem
      draggable={true}
      bgOnCollision
      gridColStart={2}
      gridColEnd={3}
      gridRowEnd={3}
      gridRowStart={2}
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
    </GridItem>
  </GridContainer>
</header>

<style lang="scss">
  header {
    width: 100%;
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

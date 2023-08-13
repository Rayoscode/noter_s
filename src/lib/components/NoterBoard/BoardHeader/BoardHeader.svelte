<script>
  import BannerBackground from "$lib/components/Banner/BannerBackground/BannerBackground.svelte";
  import { fade } from "svelte/transition";
  import GridContainer from "$lib/components/Grid/GridContainer/GridContainer.svelte";
  import GridItem from "$lib/components/Grid/GridItem/GridItem.svelte";
  import BannerHeaderTitle from "$lib/components/Banner/BannerHeaderTitle/BannerHeaderTitle.svelte";
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
  /** @type {(value:number)=>void}*/
  const changeHeaderHeight = (value) => {
    headerHeight = value;
  };
  // TODO: Cropping operation for bg img with background-position
</script>

<header style="height: {headerHeight}px;">
  <GridContainer
    gridTemplateColumnsValue={"60px repeat(4, 1fr)"}
    gridTemplateRowsValue={"repeat(5, 1fr)"}
    rowLength={5}
    colLength={5}
  >
    <GridItem
      draggable={false}
      gridColStart={1}
      gridColEnd={6}
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
      gridColEnd={2}
      gridRowStart={4}
      gridRowEnd={6}
      style={"justify-self:center; align-self:center"}
    >
      <BannerHeaderTitle title={headerData.projectName} />
    </GridItem>
  </GridContainer>
</header>

<style lang="scss">
  header {
    width: 100%;
    height: auto;
    position: relative;
  }
</style>

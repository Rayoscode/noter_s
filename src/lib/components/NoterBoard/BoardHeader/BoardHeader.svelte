<script>
  import {fade} from "svelte/transition";
  import BannerEditOptions from "$lib/components/NoterBoard/BoardHeader/BannerEditOptions/BannerEditOptions.svelte";
  import Resizable from "$lib/components/Resizable.svelte";
  //  Mock Data
  let headerData = {
    projectName:"Proyectos 1",
    iconUrl:"",
    imageCSSProps:{
      backgroundUrl:"url(https://wallpaperaccess.com/full/3497712.jpg)",
      backgroundPosition:"center"
    },
    positionXBanner:"60",
    positionYBanner:"60",
    headerHeight:300,
    headerMinHeight:200,
  }
  // TODO: Cropping operation for bg img with background-position
  let bannerWidth = 400;
  function onHorizontalResize(event){
    if(event.buttons === 1 ){

      bannerWidth += event.movementX
      console.log(bannerWidth)
    }
  }
  let bannerOptionsVisible = false;
</script>

<header>
  <div class="background-header" style="min-height: {headerData.headerMinHeight}px; height:{headerData.headerHeight}px;">
  {#if headerData.backgroundImage !== ""}
<!--      <img on:error={errorImageHandle} src={headerData.backgroundImage} style="height:{headerData.headerHeight}px" alt="Header Background Image"/>-->
    <div style="background: {headerData.imageCSSProps.backgroundUrl};
    height:{headerData.headerHeight}px;
    background-position:{headerData.imageCSSProps.backgroundPosition};
    background-size:cover"></div>
  {/if}
  </div>


<div on:mouseenter={()=>{bannerOptionsVisible = true}} on:mouseleave={()=>{bannerOptionsVisible = false}} class="title-banner"  style="top: {headerData.positionXBanner}px; left:{headerData.positionYBanner}px; width:{bannerWidth}px">
  <div>
    <Resizable onHorizontalResize={onHorizontalResize} width={bannerWidth} height="100%" resizableHorizontal={true}>
      {#if bannerOptionsVisible}
        <div in:fade={{duration:200,delay:100}} out:fade={{duration:200, delay:100}} class="option-banner-container">
          <BannerEditOptions/>
        </div>
      {/if}
      <input type="text" value={headerData.projectName}/>
    </Resizable>
  </div>
</div>
</header>

<style lang="scss">
  header{
    width: 100%;
  }
  input{
    appearance: none;
    background-color: transparent;
    outline: none;
    font-size: x-large;
    padding: 15px 30px 15px 10px;
    width: 90%;
    border:none;
    caret-color: white;
    color: white;
    &:focus{
      outline: none;
    }
  }
  .title-banner{
    border-radius: 8px;
    position:absolute;
    top:0;
    left: 0;
    background: rgba(98, 98, 98, 0.40);
    backdrop-filter: blur(4.5px);
    display: inline-block;
    > div{
      position: relative;
      .option-banner-container{
        width: 100%;
        position: absolute;
        overflow: hidden;
        padding-top: 10px;
        top: 55px;
        left: 0;
        color:white;
      }
    }
  }
  .background-header{
    width: 100%;
    max-height: 700px;
    >div{
      width: 100%;
    }
  }
</style>

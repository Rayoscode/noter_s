<script>
  import BoardHeader from "$lib/components/NoterBoard/BoardHeader/BoardHeader.svelte";
  import BoardControl from "$lib/components/NoterBoard/BoardControls/BoardControl.svelte";
  import HamburgerIcon from "$lib/assets/Icons/HamburgerIcon.svelte";
  import Grid from "$lib/assets/Icons/Grid.svelte";
  import UpArrow from "$lib/assets/Icons/UpArrow.svelte";
  import LeftArrow from "$lib/assets/Icons/LeftArrow.svelte";
  import DownArrow from "$lib/assets/Icons/DownArrow.svelte";
  import RightArrow from "$lib/assets/Icons/RightArrow.svelte";

</script>

<main class="board-container" >
  <BoardHeader></BoardHeader>
  <section >
    <div contenteditable="true">

    </div>

  </section>
  <BoardControl position="top-left">
    <div class="control-board-container">
      <HamburgerIcon/>
      <Grid/>
    </div>
  </BoardControl>
  <BoardControl position="bottom-right">
    <div class="control-board-container">
      <UpArrow></UpArrow>
      <RightArrow></RightArrow>

    </div>
  </BoardControl>
  <BoardControl position="bottom-left">
    <div class="control-board-container">
      <LeftArrow></LeftArrow>
      <DownArrow></DownArrow>
    </div>
  </BoardControl>

</main>


<style lang="scss">
  .control-board-container{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .board-container{
    background: #212121;
    box-sizing: border-box;
    width: 100vw;
    height:auto;
    min-height: 100vh;
    section{
      width: 100%;
      height: inherit;
      display: flex;
    }
  }
  [contenteditable = "true"]{
    word-break: break-all;
    padding: 5px 5px 0 5px;
    background: #212121;
    height: auto;
    width: 90%;
    min-height: 100%;
    outline: none;
    caret-color: white;
    color: white;
    &:focus{
      outline: none;
    }
  }
</style>
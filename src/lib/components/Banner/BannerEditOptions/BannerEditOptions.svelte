<script>
  import AddRounded from "$lib/assets/Icons/AddRounded.svelte";
</script>

<div>
  <AddRounded></AddRounded>
</div>


<style lang="scss">
  div{
    cursor: pointer;
    display: inline-block;
    vertical-align: center;
    text-align: center;
    margin-top: 4px;
    padding: 0 2px;

    background: rgba(98, 98, 98, 0.40);
    backdrop-filter: blur(4.5px);
    border-radius: 8px;
    transition: all 0.3s ease-out;
    &:hover{
      filter: brightness(1.2);
    }
  }
</style>
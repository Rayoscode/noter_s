<script lang="ts">
  type positions = "top-right" | "top-left" | "bottom-right" | "bottom-left"
  export let position
  let positionString=""
  switch (position) {
    case "top-right": positionString = "top:0px; right:0px; border-radius: 0 0 0 20px;"; break;
    case "top-left":  positionString = "top:0px; left:0px; border-radius: 0 0 20px 0;"; break;
    case "bottom-right": positionString = "bottom:0px; right:0px; border-radius: 20px 0 0 0; padding: 10px 10px 10px 20px; "; break;
    case "bottom-left":  positionString = "bottom:0px; left:0px; border-radius: 0 20px 0 0;";break;
    default: break;
  }
</script>
<div style={positionString}>
  <slot/>
</div>

<style>
  div{
    position: fixed;
    padding: 10px 20px 10px 10px;

    background: rgba(98, 98, 98, 0.40);
    backdrop-filter: blur(4.5px);
  }
</style>



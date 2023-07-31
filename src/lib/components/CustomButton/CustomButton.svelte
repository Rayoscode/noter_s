<script lang="ts">
  import {onMount} from "svelte";

  type  Side = "left" | "right"
  export let icon: null | HTMLOrSVGElement = null
  export let iconSide:Side = "left"
  export let onClick:(event:MouseEvent)=>void | null  = null
  export let title =""
  let buttonRef:HTMLButtonElement;
  onMount(()=>{
    if(icon){
      if(iconSide === "left"){
        buttonRef.innerHTML = icon + buttonRef.innerHTML;
      } else if (iconSide === "right"){
        buttonRef.innerHTML += icon;
      }
    }
  })
</script>
<button bind:this={buttonRef}><span>{title}</span>
</button>

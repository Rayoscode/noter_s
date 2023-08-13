<script>
  let htmlToRender = "<h1> Hola Mundo!</h1>";
  /** @type {(event:KeyboardEvent)=>void} */
  export let keyDownHandler;
  /** @type {(event:KeyboardEvent)=>void} */
  export let keyPressHandler;
</script>

<div
  on:keydown={keyDownHandler}
  on:keypress={keyPressHandler}
  contenteditable="true"
  bind:innerHTML={htmlToRender}
  role="document"
/>

<style lang="scss">
  [contenteditable="true"] {
    word-break: break-all;
    padding: 5% 20px 0 20px;
    background: #212121;
    height: auto;
    margin: auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    min-height: 100%;
    outline: none;
    caret-color: white;
    color: white;
    &:focus {
      outline: none;
    }
  }
</style>

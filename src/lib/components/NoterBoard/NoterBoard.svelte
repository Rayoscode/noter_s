<script>
  import BoardHeader from "$lib/components/NoterBoard/BoardHeader/BoardHeader.svelte";
  import BoardControl from "$lib/components/NoterBoard/BoardControls/BoardControl.svelte";
  import HamburgerIcon from "$lib/assets/Icons/HamburgerIcon.svelte";
  import Grid from "$lib/assets/Icons/Grid.svelte";
  import UpArrow from "$lib/assets/Icons/UpArrow.svelte";
  import LeftArrow from "$lib/assets/Icons/LeftArrow.svelte";
  import DownArrow from "$lib/assets/Icons/DownArrow.svelte";
  import RightArrow from "$lib/assets/Icons/RightArrow.svelte";
  import CommandSelector from "../CommandSelector/CommandSelector.svelte";
  import ContentRenderer from "../ContentRenderer/ContentRenderer.svelte";

  const commands = [
    { description: "Bold", id: "1" },
    { description: "Italic", id: "2" },
    { description: "Code", id: "3" },
  ];

  let filteredCommands = commands;
  let showCommandSelector = false;
  let commandInput = "";
  let selected = 1;
  let commandPosition = { x: 0, y: 0 };
  function onSelectedCommand() {}
  /** @type {(event:KeyboardEvent)=>void} */
  function keyPressHandler(event) {
    if (showCommandSelector) {
      commandInput += event.key;
      filteredCommands = filterCommandsByInput(commandInput);
    }
    if (!showCommandSelector && event.key === "/") {
      showCommandSelector = true;
      commandInput = "";
      filteredCommands = commands;
      let range = getSelection()?.getRangeAt(0).cloneRange();
      range?.collapse(true);
      let cursorRects = range?.getClientRects()[0];
      if (cursorRects) {
        let fontSize = window
          .getComputedStyle(range?.startContainer.parentElement, null)
          .getPropertyValue("font-size");
        commandPosition = {
          x: cursorRects.x,
          y: cursorRects.y + parseFloat(fontSize) + 10,
        };
      } else if (range?.startContainer.nodeType === 1) {
        let fontSize = window
          .getComputedStyle(range.startContainer, null)
          .getPropertyValue("font-size");
        commandPosition = {
          x: range.startContainer.offsetLeft,
          y: range.startContainer.offsetTop + parseFloat(fontSize) + 10,
        };
      }
    }
  }
  /** @type {(event:KeyboardEvent)=>void} */
  function keyDownHandler(event) {
    if (
      showCommandSelector &&
      (event.key === "Escape" ||
        filteredCommands.length === 0 ||
        (event.key === "Backspace" && commandInput.length === 0))
    ) {
      showCommandSelector = false;
    }
    if (showCommandSelector && event.key === "Backspace") {
      commandInput = commandInput.substring(0, commandInput.length - 1);
      filteredCommands = filterCommandsByInput(commandInput);
    }
  }
  /** @type {(input:string)=>{description:string,id:string}[]}*/
  function filterCommandsByInput(input) {
    input = input.toUpperCase();
    /** @type {{description:string,id:string}[]}*/
    const filtered = [];
    commands.forEach((command) => {
      if (command.description.toUpperCase().includes(input)) {
        filtered.push(command);
      }
    });
    return filtered;
  }
</script>

<main class="board-container">
  <BoardHeader />
  <section>
    <ContentRenderer {keyDownHandler} {keyPressHandler} />
  </section>
  <BoardControl position="top-left">
    <div class="control-board-container">
      <HamburgerIcon />
      <Grid />
    </div>
  </BoardControl>
  <BoardControl position="bottom-right">
    <div class="control-board-container">
      <UpArrow />
      <RightArrow />
    </div>
  </BoardControl>
  <BoardControl position="bottom-left">
    <div class="control-board-container">
      <LeftArrow />
      <DownArrow />
    </div>
  </BoardControl>
  <CommandSelector
    commands={filteredCommands}
    onSelectCommand={onSelectedCommand}
    {showCommandSelector}
    position={commandPosition}
  />
</main>

<style lang="scss">
  .control-board-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .board-container {
    background: #212121;
    box-sizing: border-box;
    width: 100%;
    height: auto;
    // TODO: Cambiar cuando se setea todo bien el size del content editable
    min-height: 100vh;
    section {
      width: 100%;
      height: inherit;
      display: flex;
    }
  }
</style>

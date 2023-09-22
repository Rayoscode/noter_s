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
  import commands from "$lib/drivers/Entities/Commands/Commands";
  import { Command } from "$lib/drivers/Entities/Command/Command";
  import { commandRenderer } from "$lib/drivers/renderer/CommandRenderer";
  let filteredCommands = commands;
  let showCommandSelector = false;
  /** @type {(value:boolean)=>void}*/
  let changeShowCommandSelector = (value) => {
    showCommandSelector = value;
  };
  let commandInput = "";
  /** @type {string | undefined}*/
  let selected = undefined;
  /**
   * @type {(newSelected:string | undefined)=>void}
   */
  function changeSelected(newSelecteded) {
    selected = newSelecteded;
  }
  let commandPosition = { x: 0, y: 0 };
  /** @type {(commandId:string | undefined)=>void}*/
  function onSelectedCommand(commandId) {
    if (commandId) {
      let elementToRender = commandRenderer(
        commands.find((command) => {
          command.id === commandId;
        })
      );
      console.log(elementToRender);
      if (elementToRender instanceof HTMLElement) {
        getSelection()?.focusNode?.insertBefore(elementToRender, null);
      }
    } else {
      let range = getSelection()?.getRangeAt(0);
      getSelection()?.removeAllRanges();
      getSelection()?.addRange(range);
    }
  }
  /** @type {(event:KeyboardEvent)=>void} */
  function keyPressHandler(event) {
    if (showCommandSelector) {
      commandInput += event.key;
      filteredCommands = filterCommandsByInput(commandInput);
      if (filteredCommands.length < 0) {
        showCommandSelector = false;
      }
    }
    if (!showCommandSelector && event.key === "/") {
      showCommandSelector = true;
      commandInput = "";
      filteredCommands = commands;
      changeSelected(filteredCommands[0].id);
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
    if (showCommandSelector && event.key === "Backspace") {
      commandInput = commandInput.substring(0, commandInput.length - 1);
      filteredCommands = filterCommandsByInput(commandInput);
    }
    if (showCommandSelector && event.key === "ArrowDown") {
      console.log(document.getElementById(selected)?.firstChild);
      document.getElementById(selected)?.firstChild.focus();
    }
    if (
      showCommandSelector &&
      (event.key === "Escape" ||
        filteredCommands.length === 0 ||
        (event.key === "Backspace" && commandInput.length <= 0) ||
        event.key === "ArrowUp")
    ) {
      showCommandSelector = false;
    }
  }
  /** @type {(input:string)=>Command[]}*/
  function filterCommandsByInput(input) {
    input = input.toUpperCase();
    /** @type {Command[]}*/
    const filtered = [];
    commands.forEach((command) => {
      if (command.name.toUpperCase().includes(input)) {
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
    {selected}
    {changeSelected}
    commands={filteredCommands}
    onSelectCommand={onSelectedCommand}
    {showCommandSelector}
    position={commandPosition}
    {changeShowCommandSelector}
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

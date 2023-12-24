<script>
  import { Editor } from "../../../Core/Editor/Editor";
  /** @type {Editor} editor */
  export let editor;
  function execute(command) {
    editor.executeCommand(command);
  }
</script>

<ul>
  <li>
    <button
      on:click={() => {
        execute("formatBold");
      }}><img src="/bold.svg" /></button
    >
  </li>
  <li>
    <button
      on:click={() => {
        execute("formatItalic");
      }}><img src="/italic.svg" /></button
    >
  </li>
  <li>
    <button
      on:click={() => {
        execute("formatUnderline");
      }}><img src="/underline.svg" /></button
    >
  </li>
  <li>
    <button
      on:click={() => {
        editor.executeCommand("insertOrderedList", {
          manager: editor.lastFocus.manager,
        });
      }}><img src="/orderedlist.svg" /></button
    >
  </li>
  <li>
    <button
      on:click={() => {
        editor.lastFocus.manager.commandInvoker.execute("insertUnorderedList", {
          editor,
          manager: editor.lastFocus.manager,
        });
      }}><img src="/unorderedlist.svg" /></button
    >
  </li>
  <li>
    <button
      on:click={() => {
        editor.lastFocus.manager.commandInvoker.execute("insertTodoList", {
          editor,
          manager: editor.lastFocus.manager,
        });
      }}><img src="/list.svg" /></button
    >
  </li>
  <li>
    <button
      on:click={() => {
        editor.executeCommand("insertHeading", { level: 1 });
      }}><img src="/h1.svg" /></button
    >
  </li>
  <li>
    <button
      on:click={() => {
        editor.executeCommand("insertHeading", { level: 2 });
      }}><img src="/h2.svg" /></button
    >
  </li>
</ul>

<style>
  ul {
    list-style: none;
    display: flex;
    gap: 10px;
    & img {
      width: 30px;
      height: 30px;
      filter: invert(1);
    }
  }
</style>

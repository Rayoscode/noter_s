<script>
  import { onMount } from 'svelte';
  import ListItem from './ListItem/ListItem.svelte';

  export let type = 'ul';
  let ref;

  onMount(() => {
    ref.props = { type };
  });
  const listType = { ul: 'ordered', ol: 'ordered', todo: 'todo' };
</script>

<svelte:element
  this={type === 'todo' ? 'ul' : type}
  class={`list ${listType[type]} component`}
  contenteditable="true"
  bind:this={ref}
>
  <ListItem {type}></ListItem>
</svelte:element>

<style>
  ul {
    background-color: blue;
  }
</style>

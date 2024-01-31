import List from '$lib/components/List/List.svelte'
import Line from '$lib/components/Line/Line.svelte'
import Heading from '$lib/components/Heading/Heading.svelte'
import Codeblock from '$lib/components/Codeblock/Codeblock.svelte'
import ListItem from '$lib/components/List/ListItem/ListItem.svelte'
export const UIComponents:any = {
  heading: Heading,
  line: Line,
  list: List,
  "list-item": ListItem,
  "code-block": Codeblock
};

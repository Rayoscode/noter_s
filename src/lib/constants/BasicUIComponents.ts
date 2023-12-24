import Heading from "../components/svelte/Heading/Heading.svelte";
import Line from "../components/svelte/Line/Line.svelte";
import List from "../components/svelte/List/List.svelte";
import { ListItem } from "../components/List/ListItem";

export const UIComponents = new Map( [
  ['heading', Heading],
  ['line', Line],
  ['list', List],
  // ['list-item', ListItem],
] );
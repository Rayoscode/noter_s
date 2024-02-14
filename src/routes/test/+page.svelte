<script>
	import Button from '$lib/MocaUI/src/components/Button/Button.svelte';
	import { events } from '$lib/core/BasicEvents/basicEvents';
</script>

<Button
	buttonProps={{
		events: {
			click: () => {
				console.log('holi mundo');
			}
		}
	}}>holi</Button
>

<script>
	import { onMount } from 'svelte';

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
	bind:this={ref}
>
</svelte:element>

<style>
	.list {
		margin-left: 15px !important;
		padding-inline-start: 0;
		margin-block-start: 2px;
		margin-block-end: 2px;
	}

	.list.todo {
		& > li {
			display: flex;
			flex-direction: row;
			gap: 0.5rem;
			align-items: center;

			& div {
				display: inline-block;
				width: 100%;
				cursor: text;

				& p {
					width: fit-content;
					position: relative;
					overflow: hidden;
					display: inline-block;
					padding: 0 2px;
				}
			}

			& input ~ div > p::before {
				display: block;
				content: '';
				position: absolute;
				top: 55%;
				left: 0;
				width: 0;
				height: 1px;
				background-color: white;
			}

			& input:checked ~ div > p::before {
				width: 100%;
			}
		}
	}
</style>

<script lang="ts">
	export let keyCode: string;
	export let onTrigger: () => void;

	function handleKeydown(event: KeyboardEvent) {
		if (event.code === keyCode && event.metaKey) {
			onTrigger();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

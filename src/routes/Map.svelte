<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { mapbox, setMapController } from '$lib/mapbox';
	import 'mapbox-gl/dist/mapbox-gl.css';

	let map: mapboxgl.Map;
	let container: HTMLDivElement;

	setMapController({
		getMap: () => map
	});

	export let projection: 'normal' | 'globe' = 'normal';
	export let zoom: number;
	export let center: [number, number];
	export let onLoad: (map: mapboxgl.Map) => void;

	onMount(async () => {
		map = new mapbox.Map({
			container,
			style: 'mapbox://styles/mapbox/outdoors-v11',
			center,
			zoom,
			pitch: 0,
			bearing: 0,
			projection:
				projection === 'globe'
					? {
							name: 'globe'
					  }
					: undefined
		});

		map.on('load', () => onLoad(map));
	});

	onDestroy(() => {
		if (map) map.remove();
	});
</script>

<div bind:this={container} id="map" class="w-full h-full">
	{#if map}
		<slot />
	{/if}
</div>

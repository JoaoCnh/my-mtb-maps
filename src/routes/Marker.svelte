<script lang="ts">
	import { onDestroy } from 'svelte';
	import { mapbox, getMapController } from '$lib/mapbox';

	import type { Map, Marker } from 'mapbox-gl';

	const { getMap } = getMapController();

	const map = getMap();

	export let lat: number;
	export let lng: number;
	export let onClick: (map: Map, marker: Marker) => void = () => {};

	const marker = new mapbox.Marker().setLngLat([lng, lat]).addTo(map);

	const markerEl = marker.getElement();

	markerEl.addEventListener('click', () => {
		onClick(map, marker);
	});

	onDestroy(() => {
		marker.remove();
	});
</script>

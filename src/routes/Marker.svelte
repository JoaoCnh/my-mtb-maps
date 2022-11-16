<script lang="ts">
	import { onDestroy } from 'svelte';
	import { mapbox, getMapController } from '$lib/mapbox';

	import type { Map, Marker } from 'mapbox-gl';

	const { getMap } = getMapController();

	const map = getMap();

	export let id: string;
	export let lat: number;
	export let lng: number;
	export let onClick: (id: string, map: Map, marker: Marker) => void = () => {};

	const marker = new mapbox.Marker().setLngLat([lng, lat]).addTo(map);

	const markerEl = marker.getElement();

	markerEl.addEventListener('click', () => {
		onClick(id, map, marker);
	});

	onDestroy(() => {
		marker.remove();
	});
</script>

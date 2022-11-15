<script lang="ts">
	import Map from './Map.svelte';
	import Key from './Key.svelte';
	import Marker from './Marker.svelte';
	import MetaCommand from './MetaCommand.svelte';
	import MapResetCommand from './MapResetCommand.svelte';

	import { defaultCenter } from '$lib/mapbox';

	import type { PageData } from './$types';

	export let data: PageData;

	function handleMapLoad(map: mapboxgl.Map) {
		map.addSource('mapbox-dem', {
			type: 'raster-dem',
			url: 'mapbox://mapbox.terrain-rgb'
		});

		map.setTerrain({
			source: 'mapbox-dem',
			exaggeration: 1.5
		});
	}

	function handleMarkerClick(map: mapboxgl.Map, marker: mapboxgl.Marker) {
		if (!map.isMoving()) {
			map.flyTo({
				center: marker.getLngLat(),
				zoom: 15,
				bearing: 130,
				pitch: 75,
				duration: 5000,
				essential: true
			});
		}
	}

	function handleRidesCommand() {}
</script>

<svelte:head>
	<title>🚵 My MTB Maps</title>
	<meta
		name="description"
		content="A demo app built with Svelte that showcases MTB trails I've ridden"
	/>
</svelte:head>

<div class="fixed top-5 left-5 z-10 flex items-center gap-2">
	<Key>⌘</Key>
	<Key>K</Key>
	<span> To bring up my rides </span>
</div>

<MetaCommand keyCode="KeyK" onTrigger={handleRidesCommand} />

<Map zoom={10} center={defaultCenter} projection="globe" onLoad={handleMapLoad}>
	{#each data.rides as ride}
		<Marker lat={ride.centerLat} lng={ride.centerLng} onClick={handleMarkerClick} />
	{/each}

	<MapResetCommand />
</Map>

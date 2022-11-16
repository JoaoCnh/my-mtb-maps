<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import Map from './Map.svelte';
	import Key from './Key.svelte';
	import Marker from './Marker.svelte';
	import MapPinIcon from './MapPinIcon.svelte';
	import MetaCommand from './MetaCommand.svelte';
	import MapResetCommand from './MapResetCommand.svelte';
	import MapAnimatedLine from './MapAnimatedLine.svelte';

	import { fetchGeoJson } from '$lib/xhr';
	import { defaultCenter } from '$lib/mapbox';

	import type { PageData } from './$types';
	import type { Ride } from '$lib/server/rides';

	export let data: PageData;

	let ridesOpen: boolean = false;
	let currentMarker: string | undefined;
	let currentGeoJson: GeoJson | undefined;

	$: isFocused = !!currentMarker;

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

	async function loadRide(rideId: string) {
		try {
			currentGeoJson = await fetchGeoJson(rideId) as GeoJson;
			currentMarker = rideId;
		} catch (error) {
			currentMarker = undefined;
			currentGeoJson = undefined;
		}
	}

	async function handleMarkerClick(markerId: string) {
		loadRide(markerId);
	}

	function handleRidesCommand() {
		ridesOpen = !ridesOpen;
	}

	function handleMapReset() {
		currentMarker = undefined;
		currentGeoJson = undefined;
	}

	async function handleRideClick(ride: Ride) {
		if (ride.id !== currentMarker) {
			loadRide(ride.id);
		}
	}
</script>

<svelte:head>
	<title>🚵 My MTB Maps</title>
	<meta
		name="description"
		content="A demo app built with Svelte that showcases MTB trails I've ridden"
	/>
</svelte:head>

<div class="fixed top-5 left-5 z-10 p-2 flex max-w-xs flex-col gap-2">
	{#if ridesOpen}
		<ul class="w-48 text-sm font-medium text-zinc-900 rounded-lg border border-orange-200">
			{#each data.rides as ride, i (ride.id)}
				<li>
					<button
						type="button"
						class="{currentMarker === ride.id ? 'bg-orange-700' : 'bg-orange-500'} {i === 0 &&
						data.rides.length > 1
							? 'rounded-t-lg'
							: 'rounded-lg'} flex items-center py-2 px-4 w-full font-medium text-left text-white border-b border-orange-200 cursor-pointer focus:outline-none hover:bg-orange-700"
						on:click={() => handleRideClick(ride)}
					>
						<MapPinIcon />
						<span class="ml-2">{ride.name}</span>
					</button>
				</li>
			{/each}
		</ul>
	{:else}
		<div class="flex items-center gap-2">
			<Key>⌘</Key>
			<Key>K</Key>
			<span> To bring up my rides </span>
		</div>
		{#if isFocused}
			<div class="flex items-center gap-2" transition:fade={{ duration: 280, easing: cubicInOut }}>
				<Key>⌘</Key>
				<Key>L</Key>
				<span> To reset the map </span>
			</div>
		{/if}
	{/if}
</div>

<MetaCommand keyCode="KeyK" onTrigger={handleRidesCommand} />

<Map zoom={10} center={defaultCenter} projection="globe" onLoad={handleMapLoad}>
	{#each data.rides as ride (ride.id)}
		<Marker id={ride.id} lat={ride.centerLat} lng={ride.centerLng} onClick={handleMarkerClick} />
	{/each}

	<MapResetCommand onReset={handleMapReset} />

	{#if !!currentGeoJson}
		<MapAnimatedLine geojson={currentGeoJson} color="#f97316" width={8} />
	{/if}
</Map>

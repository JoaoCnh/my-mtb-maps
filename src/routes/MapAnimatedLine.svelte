<script lang="ts">
	import { onDestroy } from 'svelte';
	import { mapbox, getMapController } from '$lib/mapbox';

	const { getMap } = getMapController();

	const map = getMap();

	export let color: string = '';
	export let width: number = 5;
	export let opacity: number = 1;
	export let geojson: GeoJson;

	const TRACK_SOURCE_ID = 'track-line';
	const TRACK_ANIMATION_LAYER_ID = 'track-line-animation';

	const [firstCoord, ...restOfCoords] = geojson.features[0].geometry.coordinates;

	const defaultGeoJSON = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates: [firstCoord]
				}
			}
		]
	};

	map.addSource(TRACK_SOURCE_ID, {
		type: 'geojson',
		data: defaultGeoJSON as any
	});

	map.addLayer({
		id: TRACK_ANIMATION_LAYER_ID,
		type: 'line',
		source: TRACK_SOURCE_ID,
		layout: {
			'line-cap': 'round',
			'line-join': 'round'
		},
		paint: {
			'line-color': color,
			'line-width': width,
			'line-opacity': opacity
		}
	});

	const bounds = new mapbox.LngLatBounds(
		firstCoord as unknown as [number, number],
		firstCoord as unknown as [number, number]
	);

	restOfCoords.forEach((coord) => {
		bounds.extend(coord as unknown as [number, number]);
	});

	if (!map.isMoving()) {
		map.fitBounds(bounds, {
			padding: 20,
			bearing: 130,
			pitch: 75,
			duration: 5000,
			essential: true
		});
	}

	let animation: number;
	let startTime = 0;
	let coordCount = 0;
	const duration = 5000;

	startTime = performance.now();

	animateLine();

	function easeInOutQuart(x: number): number {
		return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
	}

	function animateLine(timestamp: DOMHighResTimeStamp = 0) {
		if (!startTime) {
			startTime = timestamp;
		}

		const runtime = timestamp - startTime;
		const relativeProgress = runtime / duration;
		const easedProgress = easeInOutQuart(relativeProgress);

		coordCount = 50 * Math.min(easedProgress, 1);

		const coords = restOfCoords.splice(0, coordCount);
		// append new coordinates to the lineString
		coords.forEach((coord) => {
			defaultGeoJSON.features[0].geometry.coordinates.push(coord);
		});
		// then update the map
		// @ts-ignore
		map.getSource(TRACK_SOURCE_ID)?.setData(defaultGeoJSON);

		if (runtime < duration) {
			animation = requestAnimationFrame(animateLine);
		}
	}

	onDestroy(() => {
		cancelAnimationFrame(animation);
		map.removeLayer(TRACK_ANIMATION_LAYER_ID).removeSource(TRACK_SOURCE_ID);
	});
</script>

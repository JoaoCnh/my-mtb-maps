export async function fetchGeoJson(id: string) {
	const res = await fetch(`/geojson/${id}.geojson`);
	return await res.json();
}

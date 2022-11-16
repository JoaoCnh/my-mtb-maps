interface GeoJsonTrack extends PPInfo {
	name: string;
}

interface GeoJsonGeometry {
	type: 'LineString';
	coordinates: Array<[number, number, number]>;
}

interface GeoJsonFeature {
	type: 'Feature';
	geometry: GeoJsonGeometry;
}

interface PPInfo {
	distance: number;
	maxElevation: number;
	minElevation: number;
	uphill: number;
	difficulty: 'easy' | 'medium' | 'hard';
}

interface GeoJson {
	type: 'FeatureCollection';
	features: GeoJsonFeature[];
	pp: PPInfo;
}

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const togeojson = require('@mapbox/togeojson');
const DOMParser = require('xmldom').DOMParser;
const length = require('@turf/turf').length;

function removeFileExtension(fileName) {
	return fileName.replace(/\.(geojson|gpx)/, '');
}

function generateElevationDetails(coordinates) {
	const elevations = coordinates.map(([_lng, _lat, elev]) => elev);

	const uphill = Math.max(
		0,
		Math.ceil(
			elevations.reduce((acc, curr, index, arr) => {
				if (index === 0) return 0;

				const gain = Math.max(0, curr - arr[index - 1]);

				return acc + gain;
			}, 0)
		)
	);

	return {
		maxElevation: Math.max(0, Math.ceil(Math.max(...elevations))),
		minElevation: Math.max(0, Math.ceil(Math.min(...elevations))),
		uphill,
		difficulty: uphill < 400 ? 'easy' : uphill < 1000 ? 'medium' : 'hard'
	};
}

function parseGpxToGeoJson(gpxFiles) {
	gpxFiles.forEach((gpxFile) => {
		console.log(`✅ Converting ${gpxFile} gpx to geojson\n`);

		const gpx = new DOMParser().parseFromString(
			fs.readFileSync(path.resolve(GPX_PATH, `${gpxFile}.gpx`), 'utf8')
		);

		const geojson = togeojson.gpx(gpx);

		// we need to delete not useful information
		delete geojson.features[0].properties;
		// we add a new property for our app's information
		geojson.pp = {
			distance: Math.max(0, Math.floor(length(geojson.features[0]))),
			...generateElevationDetails(geojson.features[0].geometry.coordinates)
		};

		// stringify and minify
		const geojsonData = JSON.stringify(geojson).replace(/\s+/g, '');

		fs.writeFileSync(path.resolve(GEOJSON_PATH, `${gpxFile}.geojson`), geojsonData, 'utf8');
	});
}

console.log('🚀 Starting GPX conversion\n');

const STATIC_PATH = path.resolve('static');
const GPX_PATH = path.resolve(STATIC_PATH, 'gpx');
const GEOJSON_PATH = path.resolve(STATIC_PATH, 'geojson');

const gpxFiles = fs.readdirSync(GPX_PATH).map(removeFileExtension);

if (gpxFiles.length === 0) {
	throw `⛔ No GPX files detected in ${GPX_PATH}\n`;
} else {
	console.log(`🔍 Found ${gpxFiles.length} GPX files\n`);
}

const geoJsonFiles = fs.readdirSync(GEOJSON_PATH).map(removeFileExtension);

const prompt = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const intersection = gpxFiles.filter((file) => geoJsonFiles.includes(file));

if (intersection.length > 0) {
	prompt.question(
		`⚠️ There are ${intersection.length} already generated geojson files. Do you wish to re-generate them? (Y/n)\n`,
		(answer) => {
			if (answer.toLowerCase() === 'n') {
				parseGpxToGeoJson(gpxFiles.filter((file) => !geoJsonFiles.includes(file)));
				prompt.close();
			} else {
				parseGpxToGeoJson(gpxFiles);
				prompt.close();
			}
		}
	);
} else {
	parseGpxToGeoJson(gpxFiles);
}

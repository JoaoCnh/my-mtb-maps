import mapbox from 'mapbox-gl';
import { defineController } from '$lib/controller';
import type { Map } from 'mapbox-gl';

mapbox.accessToken =
	'pk.eyJ1Ijoiam9hb2NuaCIsImEiOiJjbDVvZXE1dmwxY3UwM2ptZzZxNmpjbm02In0.i_a0ZE5B6XjUElLibp_wJw';

const defaultCenter: [number, number] = [-8.61135, 41.153158];

const key = Symbol();

interface IMapController {
	getMap: () => Map;
}

const [getMapController, setMapController] = defineController<IMapController>(key);

export { mapbox, defaultCenter, setMapController, getMapController };

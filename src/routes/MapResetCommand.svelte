<script>
	import MetaCommand from './MetaCommand.svelte';

	import { defaultCenter, getMapController } from '$lib/mapbox';

	const { getMap } = getMapController();

	const map = getMap();

	function handleMapResetCommand() {
		if (!map.isMoving()) {
			map.flyTo({
				center: defaultCenter,
				zoom: 10,
				bearing: 0,
				pitch: 0,
				duration: 2500,
				essential: true
			});
		}
	}
</script>

<MetaCommand keyCode="KeyL" onTrigger={handleMapResetCommand} />

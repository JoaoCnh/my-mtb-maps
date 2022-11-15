import { rides } from '$lib/server/rides';

/** @type {import('./$types').PageServerLoad} */
export function load() {
	return {
		rides
	};
}

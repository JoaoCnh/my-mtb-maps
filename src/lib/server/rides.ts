export interface Ride {
	id: string;
	name: string;
	centerLat: number;
	centerLng: number;
}

export const rides: Ride[] = [
	{
		id: 'meia-perna',
		name: 'Meia Perna',
		centerLat: 41.22654,
		centerLng: -8.57923
	}
];

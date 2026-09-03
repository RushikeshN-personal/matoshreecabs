export interface PickupLocation {
  id: string;
  city: string;
  state: string;
  country: string;
}

// Cities we currently pick up from. Rates are still a single shared rate
// card per vehicle/mode (not per-city) — this only captures where the rider
// actually is; per-city pricing is a future enhancement.
export const PICKUP_LOCATIONS: PickupLocation[] = [
  { id: 'PUNE', city: 'Pune', state: 'Maharashtra', country: 'India' },
  { id: 'MUMBAI', city: 'Mumbai', state: 'Maharashtra', country: 'India' },
  { id: 'NAVI_MUMBAI', city: 'Navi Mumbai', state: 'Maharashtra', country: 'India' },
  { id: 'THANE', city: 'Thane', state: 'Maharashtra', country: 'India' },
  { id: 'NASHIK', city: 'Nashik', state: 'Maharashtra', country: 'India' },
  { id: 'NAGPUR', city: 'Nagpur', state: 'Maharashtra', country: 'India' },
  { id: 'SATARA', city: 'Satara', state: 'Maharashtra', country: 'India' },
  { id: 'KARAD', city: 'Karad', state: 'Maharashtra', country: 'India' },
  { id: 'KOLHAPUR', city: 'Kolhapur', state: 'Maharashtra', country: 'India' },
  { id: 'SOLAPUR', city: 'Solapur', state: 'Maharashtra', country: 'India' },
  { id: 'SANGLI', city: 'Sangli', state: 'Maharashtra', country: 'India' },
  { id: 'NANDED', city: 'Nanded', state: 'Maharashtra', country: 'India' },
];

export const PICKUP_LOCATION_IDS = PICKUP_LOCATIONS.map((l) => l.id) as [string, ...string[]];

export const DEFAULT_PICKUP_LOCATION_ID = 'PUNE';

export function formatPickupLocation(loc: PickupLocation): string {
  return `${loc.city}, ${loc.state}, ${loc.country}`;
}

export function findPickupLocation(id: string): PickupLocation {
  return PICKUP_LOCATIONS.find((l) => l.id === id) ?? PICKUP_LOCATIONS[0];
}

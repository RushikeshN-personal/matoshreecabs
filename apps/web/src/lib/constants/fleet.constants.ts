export const FLEET_HEADING = "Rent a Car";
export const FLEET_INTRO =
  "Every cab is driver-verified and maintained for long trips — rent one for a full day, message us on WhatsApp to book.";
export const FLEET_FALLBACK_RATE_NOTE = "Rate on request";

// Keyed by Vehicle.name from the catalogue. Falls back to a generic line
// built from seating/fuel type if a name isn't in this map.
export const FLEET_DESCRIPTIONS: Record<string, string> = {
  Sedan:
    "A comfortable, fuel-efficient sedan built for airport runs and city hops — a roomy boot, a smooth ride, and easy to park on Pune's busy streets.",
  Ertiga:
    "Our go-to family MPV. Three rows of seating and generous luggage room make it the natural pick for group outstation trips and full-family outings.",
  SUV:
    "A powerful 7-seater SUV for long-distance comfort — commanding road presence, higher ground clearance, and space for the whole group plus luggage.",
  Nexon:
    "A compact SUV that's nimble in city traffic and confident on the highway, with a raised driving position and a modern cabin.",
};

export const FLEET_IMAGE_CREDIT = "Vehicle photos: Wikimedia Commons (CC BY-SA)";

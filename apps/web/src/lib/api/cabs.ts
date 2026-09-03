const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001/api";

export interface RateCard {
  id: string;
  mode: string;
  packageKm: number;
  baseRate: string;
  extraKmRate: string;
  extraHrRate: string;
  driverAllowance: string;
  nightCharge: string;
}

export interface Vehicle {
  id: string;
  name: string;
  description?: string | null;
  seating: number;
  luggage: number;
  ac: boolean;
  fuelType: string;
  features: string[];
  images: string[];
  // The list endpoint includes only the RENTAL rate card, for the home
  // page's daily-rent price — everything else comes from fetchCab().
  rateCards?: RateCard[];
}

export interface VehicleDetail extends Vehicle {
  rateCards: RateCard[];
}

export async function fetchCabs(): Promise<Vehicle[]> {
  const res = await fetch(`${API}/cabs`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load cabs");
  return res.json();
}

export async function fetchCab(id: string): Promise<VehicleDetail> {
  const res = await fetch(`${API}/cabs/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Not found");
  return res.json();
}
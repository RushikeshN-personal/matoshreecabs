export type ServiceIcon = "airport" | "intercity" | "outstation";

export interface ServiceItem {
  icon: ServiceIcon;
  label: string;
}

// Matches the backend service set (PRD): airport, inter-city/rental, outstation.
export const SERVICES: ServiceItem[] = [
  { icon: "airport", label: "Airport Pickup & Drop Off" },
  { icon: "intercity", label: "Inter-City / Rental Trips" },
  { icon: "outstation", label: "Out Station Travel" },
];
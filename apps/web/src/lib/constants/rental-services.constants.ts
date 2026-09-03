export type RentalIcon = "economy" | "luxury" | "event" | "corporate" | "local";

export interface RentalService {
  icon: RentalIcon;
  title: string;
  description: string;
  href: string;
}

export const RENTAL_SERVICES_HEADING = "Our Services";
export const RENTAL_SERVICES_INTRO =
  "Whatever the trip, there's a Matoshree Cabs option built for it.";

export const RENTAL_SERVICES: RentalService[] = [
  {
    icon: "economy",
    title: "Economy Car Rental",
    description:
      "Budget-friendly sedans and hatchbacks for everyday city travel, airport runs, and short local trips — no compromise on reliability.",
    href: "/cabs",
  },
  {
    icon: "luxury",
    title: "Luxury Car Rental",
    description:
      "Premium sedans and SUVs for clients, weddings, and special occasions — a comfortable, professional ride when it matters.",
    href: "/cabs",
  },
  {
    icon: "event",
    title: "Event Car Rental",
    description:
      "Multi-vehicle bookings for weddings, conferences, and group events — coordinated pickups so your guests arrive on time, together.",
    href: "/contact",
  },
  {
    icon: "corporate",
    title: "Corporate Car Rental",
    description:
      "Reliable, billable rides for business travel and employee transport, with verified drivers and on-time pickups you can count on.",
    href: "/contact",
  },
  {
    icon: "local",
    title: "Local City Rentals",
    description:
      "Point-to-point or full-day local packages (8Hr/80KM and more) — ideal for city errands, meetings, or a day of sightseeing.",
    href: "/#trips",
  },
];

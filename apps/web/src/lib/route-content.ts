import type { RouteService } from "@/lib/constants/route-services.constants";
import {
  resolveLocationInfo,
  PUNE_IMAGE,
  MUMBAI_IMAGE,
} from "@/lib/constants/location-info.constants";

// Builds the page copy for a route from its label/from/to — this is a
// template, not hand-written per-route content: with ~50 routes (many are
// query variants of the same handful of real trips), individually authoring
// each page isn't practical, so the copy adapts to keywords in the route
// label and to which two cities are actually involved.
export function buildRouteIntro(route: RouteService): string {
  const { label, fromCity, toCity } = route;
  const l = label.toLowerCase();

  if (l.includes("airport")) {
    return `Book a reliable ${fromCity} to ${toCity} cab with Matoshree Cabs — on-time pickup, a verified driver, and enough buffer built into the schedule so you're never rushing for your flight.`;
  }
  if (l.includes("one way")) {
    return `Travelling ${fromCity} to ${toCity} and not coming back the same way? Book a one-way cab with Matoshree Cabs — you only pay for the trip you take, no return-leg charge.`;
  }
  if (l.includes("taxi fare") || l.includes("fare")) {
    return `Wondering what a ${fromCity} to ${toCity} taxi costs? Fares depend on the cab type and exact pickup point — get an instant, itemised estimate by starting a booking below, no obligation to confirm.`;
  }
  if (l.includes("online") || l.includes("booking")) {
    return `Book your ${fromCity} to ${toCity} cab online in a couple of minutes — pick your cab, confirm the trip, and pay the driver directly at the end. No app download, no advance payment.`;
  }
  if (l.includes("car hire")) {
    return `Looking to hire a car for ${fromCity} to ${toCity}? Matoshree Cabs offers sedans, MPVs and SUVs with a verified driver, ready for same-day or advance booking.`;
  }
  if (l.includes("ertiga") || l.includes("innova")) {
    const vehicle = l.includes("innova") ? "Innova Crysta-class SUV" : "Ertiga";
    return `Need extra space for the ${fromCity} to ${toCity} trip? Book a ${vehicle} with Matoshree Cabs — comfortable three-row seating for families and small groups.`;
  }
  return `Matoshree Cabs runs regular ${fromCity} to ${toCity} cab trips — a comfortable, verified ride booked in minutes, with the fare confirmed up front.`;
}

export function buildRouteHighlights(_route: RouteService): string[] {
  return [
    "Verified, experienced drivers",
    "Sedan, MPV and SUV options",
    "Transparent, itemised fare estimate",
    "Pay the driver directly — no advance required",
    "One-way and round-trip both available",
    "Book online or over WhatsApp in minutes",
  ];
}

export interface RouteFaq {
  question: string;
  answer: string;
}

export function buildRouteFaq(route: RouteService): RouteFaq[] {
  return [
    {
      question: "Do I need to pay an advance to confirm this booking?",
      answer:
        "No. Matoshree Cabs doesn't take an advance or online payment — you pay the driver directly, by cash or UPI, once the trip is done.",
    },
    {
      question: `What cab types are available for ${route.fromCity} to ${route.toCity}?`,
      answer:
        "Sedans, MPVs (like the Ertiga), and SUVs — pick whichever fits your group size and luggage when you book.",
    },
    {
      question: "Can I book a one-way trip, or only round trips?",
      answer:
        "Both. Let us know which you need when you book (or message us on WhatsApp) and the fare is adjusted accordingly.",
    },
    {
      question: "How do I confirm my booking?",
      answer:
        "Book online through the site, or message us directly on WhatsApp — either way, we confirm your driver and vehicle before the trip.",
    },
    {
      question: "What if my plans change after booking?",
      answer:
        "You can cancel from My Bookings if you booked with an account, or just message us — since there's no advance payment, there's nothing to refund.",
    },
  ];
}

// ---------------- distance/duration ----------------

interface TripEstimate {
  km: number;
  duration: string;
}

// Approximate road distance/duration by car — for orientation only, not a
// quoted fare. Keyed by the two cities' normalised group (see cityGroup).
const DISTANCE_TABLE: Record<string, TripEstimate> = {
  "Mumbai|Pune": { km: 150, duration: "~3 hrs" },
  "Nashik|Pune": { km: 210, duration: "~4 hrs" },
  "Nagpur|Pune": { km: 710, duration: "~10-11 hrs" },
  "Pune|Satara": { km: 110, duration: "~2 hrs" },
  "Pune|Sangli": { km: 230, duration: "~4.5 hrs" },
  "Pune|Solapur": { km: 250, duration: "~4.5 hrs" },
  "Kolhapur|Pune": { km: 230, duration: "~4.5 hrs" },
  "Nanded|Pune": { km: 450, duration: "~8 hrs" },
  "Kolhapur|Satara": { km: 110, duration: "~2.5 hrs" },
  "Mumbai|Satara": { km: 250, duration: "~5 hrs" },
};

function cityGroup(name: string): string {
  const info = resolveLocationInfo(name);
  if (info.image === PUNE_IMAGE) return "Pune";
  if (info.image === MUMBAI_IMAGE) return "Mumbai";
  return name;
}

export function estimateTripInfo(route: RouteService): TripEstimate | null {
  const a = cityGroup(route.fromCity);
  const b = cityGroup(route.toCity);
  if (a === b) return null;
  const key = [a, b].sort().join("|");
  return DISTANCE_TABLE[key] ?? null;
}

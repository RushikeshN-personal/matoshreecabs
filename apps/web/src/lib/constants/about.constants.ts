export interface AboutStat {
  value: number;
  suffix: string;
  label: string;
}

export interface AboutValue {
  title: string;
  body: string;
}

export const ABOUT_HEADING = "About Matoshree Cabs";
export const ABOUT_INTRO =
  "Matoshree Cabs is a Pune-based cab service built for reliable, transparent travel — local rides, airport transfers, outstation trips, and rentals. Clear pricing, verified drivers, and a booking that takes minutes.";

export const ABOUT_STATS: AboutStat[] = [
  { value: 12000, suffix: "+", label: "Rides completed" },
  { value: 50, suffix: "+", label: "Routes from Pune" },
  { value: 4.7, suffix: "/5", label: "Average rating" },
  { value: 24, suffix: "x7", label: "Support" },
];

export const ABOUT_VALUES: AboutValue[] = [
  { title: "Transparent Pricing", body: "The fare you see is the fare you pay — itemised before you book, no surprises." },
  { title: "Verified Drivers", body: "Every driver is background-checked and trained for safe, courteous trips." },
  { title: "On-Time, Every Time", body: "Punctual pickups for airports and outstation trips, so you never rush." },
  { title: "Always Reachable", body: "Book on call or online, with support available around the clock." },
];
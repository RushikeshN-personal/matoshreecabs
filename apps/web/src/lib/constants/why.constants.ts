export const WHY_HEADING = "Why choose Matoshree Cabs";
export const WHY_INTRO =
  "Pune's dependable ride partner — transparent fares, verified drivers, and support that actually picks up.";

export interface WhyFeature {
  icon: "shield" | "rupee" | "clock" | "headset" | "route" | "star";
  title: string;
  body: string;
}

export const WHY_FEATURES: WhyFeature[] = [
  { icon: "rupee", title: "Transparent Pricing", body: "See an itemised fare before you book. The price you're quoted is the price you pay — no hidden extras." },
  { icon: "shield", title: "Verified Drivers", body: "Every driver is background-checked, licensed, and trained for safe, courteous trips." },
  { icon: "clock", title: "On-Time, Always", body: "Punctual pickups for airports and outstation trips, so you never have to rush or wait." },
  { icon: "route", title: "50+ Routes from Pune", body: "Local rides, airport transfers, and popular outstation routes — all from one place." },
  { icon: "headset", title: "24×7 Support", body: "Book on call or online. Real people, reachable around the clock for any change of plan." },
  { icon: "star", title: "Highly Rated", body: "Thousands of completed trips and a 4.7-star average from travellers who ride with us." },
];

export interface WhyCompareRow {
  point: string;
  matoshreecabs: boolean;
  others: boolean;
}

export const WHY_COMPARE: WhyCompareRow[] = [
  { point: "Fare shown before booking", matoshreecabs: true, others: false },
  { point: "No surge / hidden charges", matoshreecabs: true, others: false },
  { point: "Verified, trained drivers", matoshreecabs: true, others: true },
  { point: "Fixed outstation packages", matoshreecabs: true, others: false },
  { point: "24×7 human support", matoshreecabs: true, others: false },
];
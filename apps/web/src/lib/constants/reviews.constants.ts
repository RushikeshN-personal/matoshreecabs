export interface DemoReview {
  name: string;
  rating: number;
  text: string;
}

export const REVIEWS_HEADING = "What our customers say";
// Photo: Wikimedia Commons (CC BY-SA), hotlink-safe.
export const REVIEWS_BG =
  "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/hero/reviews_01.png";

export const DEMO_REVIEWS: DemoReview[] = [
  { name: "Ravi Deshmukh", rating: 5, text: "Booked a Pune–Mahabaleshwar trip. Clean car, on-time driver, exactly the fare quoted. Will use again." },
  { name: "Sneha Kulkarni", rating: 5, text: "Airport drop at 4 AM went perfectly. Driver was punctual and polite. Highly recommend." },
  { name: "Amit Sharma", rating: 4, text: "Good outstation service to Shirdi. Transparent pricing and easy booking on call." },
];
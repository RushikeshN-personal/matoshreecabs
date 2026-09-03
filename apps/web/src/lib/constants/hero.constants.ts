export interface HeroSlide {
  image?: string; // optional: drop files in apps/web/public/hero/ and set the path
  gradient: string; // shown as fallback when no image is set
}

// The scroller cross-fades through these. Photos: Wikimedia Commons (CC
// BY-SA / CC BY), hotlink-safe — gradient is the fallback if one fails.
export const HERO_SLIDES: HeroSlide[] = [
  {
    image:
      "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/hero/banner_01.png",
    gradient: "linear-gradient(120deg,#7c2d12,#ea580c)",
  },
  {
    image:
      "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/hero/banner_02.png",
    gradient: "linear-gradient(120deg,#111827,#f97316)",
  },
  {
    image:
      "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/hero/banner_03.png",
    gradient: "linear-gradient(120deg,#9a3412,#fb923c)",
  },
];

export const HERO_ROTATE_MS = 5000;
export const HERO_HEADING_PREFIX = "Your ride from";
export const HERO_HEADING_SUFFIX = "anywhere you go";
export const HERO_CITY_ROTATE_MS = 2600;
export const HERO_SUBHEADING =
  "Local, outstation, airport and rental cabs — booked in minutes.";
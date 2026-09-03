import type { Destination } from "./destination.types";

export const BEACH_DESTINATIONS_HEADING = "Beach Getaways";

// Routes from Pune. Drop photos in apps/web/public/trips/ and set `image`.
export const BEACH_DESTINATIONS: Destination[] = [
  {
    title: "Alibaug",
    image: "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/beach/alibaug.png",
    location_details:
      "Alibaug is a coastal town in the Raigad district of Maharashtra, a popular weekend getaway from Pune and Mumbai. Known for its black-sand beaches, the historic Kolaba Fort accessible on foot at low tide, and a laid-back Konkan atmosphere, it's a favourite for short beach breaks, water sports, and seafood.",
  },
  {
    title: "Murud-Janjira",
    image: "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/beach/murud_janjira.png",
    location_details:
      "Murud is a quiet beach town best known for Janjira Fort, an impregnable island fortress reachable by boat just off the coast. With clean sands, coconut groves, and far fewer crowds than Alibaug, it's a good pick for a relaxed day trip or overnight stay.",
  },
  {
    title: "Diveagar",
    image: "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/beach/diveagar.png",
    location_details:
      "Diveagar is a lesser-known Konkan beach village in Raigad district, with a long stretch of clean, uncrowded sand backed by casuarina and coconut trees. It's known for its calm waters, the nearby Suvarna Ganesh temple, and a peaceful pace that suits travellers looking to avoid the crowds of Alibaug.",
  },
  {
    title: "Kashid",
    image: "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/beach/kashid.png",
    location_details:
      "Kashid is known for its white sand beach — a rarity on the largely black-sand Konkan coast — set against a backdrop of green hills. It's close to Murud and Janjira Fort, making it easy to combine into a single day trip from Pune.",
  },
  {
    title: "Ganpatipule",
    image: "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/beach/ganpatipule.png",
    location_details:
      "Ganpatipule is a temple town on the Ratnagiri coast, home to a 400-year-old swayambhu (self-manifested) Ganesha temple right on the beachfront. It combines a pilgrimage stop with a clean, scenic beach, making it a popular combined religious-and-leisure trip from Pune.",
  },
  {
    title: "Tarkarli",
    image: "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/beach/tarkarli.png",
    location_details:
      "Tarkarli, in the Sindhudurg district near Malvan, is known for exceptionally clear turquoise water and is one of Maharashtra's best spots for scuba diving and water sports. It's a longer outstation drive from Pune, best suited to a multi-day trip combined with Sindhudurg Fort.",
  },
];

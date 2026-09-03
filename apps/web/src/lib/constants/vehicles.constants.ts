export interface DemoVehicle {
  id: string;
  name: string;
  seats: number;
  image?: string; // optional: /public/vehicles/<file>; falls back to a car icon
}

export const DEMO_VEHICLES: DemoVehicle[] = [
  { id: "sedan", name: "Sedan", seats: 4, image: "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/vehicals/sedan.png" },
  { id: "ertiga", name: "Ertiga", seats: 6, image: "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/vehicals/Ertiga.png" },
  { id: "suv", name: "SUV", seats: 7, image: "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/vehicals/suv.png" },
];
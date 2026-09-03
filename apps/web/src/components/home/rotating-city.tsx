"use client";

import { useEffect, useState } from "react";
import { PICKUP_LOCATIONS } from "@matoshreecabs/shared";
import { HERO_CITY_ROTATE_MS } from "@/lib/constants/hero.constants";

// Cycles through every pickup city with a 3D flip. Plain CSS 3D transforms
// give the same "depth" feel as a three.js text scene for a fraction of the
// bundle size/GPU cost — worth it for a single rotating word.
export function RotatingCity() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PICKUP_LOCATIONS.length);
    }, HERO_CITY_ROTATE_MS);
    return () => clearInterval(timer);
  }, []);

  const city = PICKUP_LOCATIONS[index].city;

  return (
    <span className="inline-block [perspective:400px]">
      <span key={city} className="animate-city-flip text-orange-400">
        {city}
      </span>
    </span>
  );
}

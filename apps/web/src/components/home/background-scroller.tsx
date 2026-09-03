"use client";

import { useEffect, useState } from "react";
import { HERO_SLIDES, HERO_ROTATE_MS } from "@/lib/constants/hero.constants";

export function BackgroundScroller() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % HERO_SLIDES.length);
    }, HERO_ROTATE_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {HERO_SLIDES.map((slide, idx) => (
        <div
          key={idx}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: slide.image
              ? `url(${slide.image}), ${slide.gradient}`
              : slide.gradient,
            opacity: idx === active ? 1 : 0,
          }}
        />
      ))}
      {/* dark overlay so the white form and text stay readable */}
      <div className="absolute inset-0 bg-black/55" />
    </div>
  );
}
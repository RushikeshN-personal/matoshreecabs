"use client";

import { useRef } from "react";
import type { Destination } from "@/lib/constants/destination.types";
import { DestinationCard } from "./destination-card";

const SCROLL_STEP = 324; // card width (300) + gap (24)

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path
        d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface DestinationSectionProps {
  id: string;
  heading: string;
  items: Destination[];
  tone?: "light" | "dark";
}

// Shared horizontal-scroll section used for Hill Stations, Religious Places,
// and Beach Getaways — same layout as Popular Trips, different data shape
// (a description paragraph instead of a from/to route).
export function DestinationSection({ id, heading, items, tone = "light" }: DestinationSectionProps) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scroller.current?.scrollBy({
      left: dir === "left" ? -SCROLL_STEP : SCROLL_STEP,
      behavior: "smooth",
    });
  };

  if (items.length === 0) return null;

  const isDark = tone === "dark";

  return (
    <section
      id={id}
      className={
        "relative overflow-hidden py-12 " + (isDark ? "bg-gray-900" : "bg-white")
      }
    >
      {isDark && (
        <div className="absolute inset-0 -z-0 bg-gradient-to-b from-gray-800 to-gray-900" />
      )}

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2
            className={
              "border-l-4 border-orange-500 pl-3 text-3xl font-extrabold " +
              (isDark ? "text-white" : "text-gray-900")
            }
          >
            {heading}
          </h2>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-600 text-white transition-colors hover:bg-orange-700"
            >
              <Arrow dir="left" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-600 text-white transition-colors hover:bg-orange-700"
            >
              <Arrow dir="right" />
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <DestinationCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

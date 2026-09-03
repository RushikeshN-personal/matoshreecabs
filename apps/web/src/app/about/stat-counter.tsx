"use client";

import { useEffect, useRef, useState } from "react";
import type { AboutStat } from "@/lib/constants/about.constants";

const DURATION_MS = 1500;

export function StatCounter({ stat }: { stat: AboutStat }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  // Start counting only when the card scrolls into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animate from 0 to the target once started.
  useEffect(() => {
    if (!started) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      setDisplay(stat.value * progress);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, stat.value]);

  const isDecimal = !Number.isInteger(stat.value);
  const shown = isDecimal ? display.toFixed(1) : Math.round(display).toLocaleString();

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-orange-100 bg-white p-6 text-center shadow-sm"
    >
      <div className="text-3xl font-extrabold text-orange-600 sm:text-4xl">
        {shown}
        {stat.suffix}
      </div>
      <div className="mt-1 text-sm font-medium text-gray-600">{stat.label}</div>
    </div>
  );
}
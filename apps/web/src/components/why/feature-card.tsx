"use client";

import { useEffect, useRef, useState } from "react";
import type { WhyFeature } from "@/lib/constants/why.constants";
import { WhyIcon } from "./why-icon";

export function FeatureCard({ feature, index }: { feature: WhyFeature; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setShow(true),
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 80}ms` }}
      className={
        "group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg " +
        (show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0")
      }
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 transition-colors group-hover:bg-orange-100">
        <WhyIcon name={feature.icon} />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.body}</p>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCabs, type Vehicle } from "@/lib/api/cabs";

export function RouteVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCabs()
      .then(setVehicles)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-gray-500">Loading available cabs…</p>;
  if (vehicles.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {vehicles.map((v) => (
        <Link
          key={v.id}
          href={`/cabs/${v.id}`}
          className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-lg"
        >
          <div
            className="h-28 w-full bg-cover bg-center"
            style={{
              backgroundImage: v.images?.[0]
                ? `url(${v.images[0]}), linear-gradient(120deg,#9a3412,#f97316)`
                : "linear-gradient(120deg,#9a3412,#f97316)",
            }}
          />
          <div className="p-3">
            <p className="font-semibold text-gray-900">{v.name}</p>
            <p className="text-xs text-gray-500">
              {v.seating} seats · {v.fuelType} · {v.ac ? "AC" : "Non-AC"}
            </p>
            <span className="mt-2 inline-block text-xs font-semibold text-orange-600 group-hover:text-orange-700">
              View & book →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

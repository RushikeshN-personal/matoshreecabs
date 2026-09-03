"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCabs, type Vehicle } from "@/lib/api/cabs";
import {
  FLEET_HEADING,
  FLEET_INTRO,
  FLEET_DESCRIPTIONS,
  FLEET_FALLBACK_RATE_NOTE,
} from "@/lib/constants/fleet.constants";
import { SITE } from "@/lib/constants/site.constants";

function describe(v: Vehicle): string {
  return (
    v.description ||
    FLEET_DESCRIPTIONS[v.name] ||
    `A ${v.seating}-seat ${v.ac ? "AC" : "non-AC"} ${v.fuelType.toLowerCase()} cab, ready for local and outstation trips.`
  );
}

function dailyRate(v: Vehicle): string | null {
  const rc = v.rateCards?.find((r) => r.mode === "RENTAL");
  return rc ? rc.baseRate : null;
}

function whatsappHrefFor(v: Vehicle, rate: string | null): string {
  const message = rate
    ? `Hi, I'd like to rent the ${v.name} for a day (₹${rate}/day). Please confirm availability.`
    : `Hi, I'd like to rent the ${v.name} for a day. Please share the rate and confirm availability.`;
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function CarCollection() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCabs()
      .then(setVehicles)
      .finally(() => setLoading(false));
  }, []);

  if (!loading && vehicles.length === 0) return null;

  return (
    <section id="fleet" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{FLEET_HEADING}</h2>
          <p className="mt-3 text-gray-600">{FLEET_INTRO}</p>
        </div>

        {loading ? (
          <p className="mt-10 text-center text-sm text-gray-500">Loading fleet…</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {vehicles.map((v) => {
              const rate = dailyRate(v);
              return (
                <div
                  key={v.id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-lg"
                >
                  <div className="h-44 w-full bg-gray-100">
                    {v.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={v.images[0]}
                        alt={v.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : null}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900">{v.name}</h3>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {v.seating} seats · {v.fuelType} · {v.ac ? "AC" : "Non-AC"}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{describe(v)}</p>

                    <p className="mt-3 text-sm font-semibold text-gray-900">
                      {rate ? (
                        <>
                          ₹{rate}{" "}
                          <span className="font-normal text-gray-500">/ day</span>
                        </>
                      ) : (
                        <span className="font-normal text-gray-500">
                          {FLEET_FALLBACK_RATE_NOTE}
                        </span>
                      )}
                    </p>

                    <a
                      href={whatsappHrefFor(v, rate)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-700"
                    >
                      Rent via WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-2 text-center">
          <Link
            href="/cabs"
            className="rounded-lg border border-orange-200 px-5 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50"
          >
            View full catalogue
          </Link>
        </div>
      </div>
    </section>
  );
}

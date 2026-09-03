import type { Metadata } from "next";
import { fetchCabs, type Vehicle } from "@/lib/api/cabs";
import { SITE } from "@/lib/constants/site.constants";

export const metadata: Metadata = {
  title: "Price Catalog — Matoshree Cabs",
  description: "Outstation tariff per vehicle — package km, extra km rate, and driver allowance.",
};

function whatsappHrefFor(v: Vehicle): string {
  const message = `Hi, I'd like to book the ${v.name} for an outstation trip. Please confirm availability.`;
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export default async function PriceCatalogPage() {
  let vehicles: Vehicle[] = [];
  try {
    vehicles = await fetchCabs();
  } catch {
    vehicles = [];
  }

  const withOutstationRate = vehicles
    .map((v) => ({ vehicle: v, rate: v.rateCards?.find((r) => r.mode === "OUTSTATION") }))
    .filter((x): x is { vehicle: Vehicle; rate: NonNullable<typeof x.rate> } => !!x.rate);

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-orange-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Price Catalog</h1>
          <p className="mt-4 text-gray-600">
            {SITE.name} — outstation tariff, per vehicle. Toll, tax and parking are always extra,
            and shown separately at the end of the trip.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        {withOutstationRate.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            No outstation rates published yet — check back soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {withOutstationRate.map(({ vehicle, rate }) => (
              <div
                key={vehicle.id}
                className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="bg-gray-900 px-5 py-3">
                  <p className="text-lg font-extrabold text-white">{vehicle.name}</p>
                  <p className="text-xs text-gray-400">
                    {vehicle.seating} Seater · {vehicle.fuelType}
                  </p>
                </div>
                <div className="space-y-2 p-5">
                  <p className="text-2xl font-extrabold text-orange-600">
                    ₹{rate.baseRate}
                    <span className="ml-1 text-sm font-normal text-gray-500">
                      / {rate.packageKm} km
                    </span>
                  </p>
                  <dl className="space-y-1 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <dt>Extra km</dt>
                      <dd className="font-semibold">₹{rate.extraKmRate}</dd>
                    </div>
                    {Number(rate.driverAllowance) > 0 && (
                      <div className="flex justify-between">
                        <dt>Driver allowance</dt>
                        <dd className="font-semibold">₹{rate.driverAllowance} (extra)</dd>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-500">
                      <dt>Toll, tax &amp; parking</dt>
                      <dd>Extra</dd>
                    </div>
                  </dl>
                  <a
                    href={whatsappHrefFor(vehicle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block rounded-lg bg-green-600 px-4 py-2 text-center text-sm font-bold text-white hover:bg-green-700"
                  >
                    Book on WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-gray-400">
          Rates shown are for a one-way outstation trip and may vary by route — message us for an
          exact fare. Managed by {SITE.name}, editable anytime from the admin panel.
        </p>
      </section>
    </div>
  );
}

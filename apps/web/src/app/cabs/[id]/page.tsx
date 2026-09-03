import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchCab, type VehicleDetail } from "@/lib/api/cabs";
import { BOOKING_MODE_LABELS } from "@matoshreecabs/shared";
import { CabGallery } from "@/components/cabs/cab-gallery";
import { BOOK_RIDE_HREF } from "@/lib/constants/nav.constants";
import { SITE } from "@/lib/constants/site.constants";

export default async function CabDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let cab: VehicleDetail;
  try {
    cab = await fetchCab(id);
  } catch {
    notFound();
  }

  const whatsappMessage = `Hi, I'd like to book the ${cab.name}.`;
  const whatsappHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/cabs" className="text-sm text-orange-600 hover:underline">
        ← Back to cabs
      </Link>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <CabGallery images={cab.images ?? []} alt={cab.name} />

        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">{cab.name}</h1>
          <p className="mt-1 text-gray-600">
            {cab.seating} seats · {cab.luggage} bags · {cab.fuelType} ·{" "}
            {cab.ac ? "AC" : "Non-AC"}
          </p>

          {cab.description && (
            <p className="mt-4 text-sm leading-relaxed text-gray-700">{cab.description}</p>
          )}

          {cab.features?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Features
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cab.features.map((f) => (
                  <span
                    key={f}
                    className="rounded-full bg-orange-50 px-2.5 py-1 text-xs text-orange-700"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {cab.rateCards?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Best for
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cab.rateCards.map((r) => (
                  <span
                    key={r.id}
                    className="rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-700"
                  >
                    {BOOKING_MODE_LABELS[r.mode] ?? r.mode}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-700"
            >
              Book on WhatsApp
            </a>
            <Link
              href={BOOK_RIDE_HREF}
              className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700"
            >
              Book this cab
            </Link>
          </div>
        </div>
      </div>

      {cab.rateCards?.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 text-xl font-bold text-gray-900">Fares</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-orange-50 text-left text-orange-800">
                <tr>
                  <th className="px-4 py-2">Package</th>
                  <th className="px-4 py-2">Base</th>
                  <th className="px-4 py-2">Extra/km</th>
                  <th className="px-4 py-2">Extra/hr</th>
                  <th className="px-4 py-2">Driver allowance</th>
                </tr>
              </thead>
              <tbody>
                {cab.rateCards.map((r) => (
                  <tr key={r.id} className="border-t border-gray-100">
                    <td className="px-4 py-2 font-medium">
                      {BOOKING_MODE_LABELS[r.mode] ?? r.mode}
                    </td>
                    <td className="px-4 py-2">₹{r.baseRate}</td>
                    <td className="px-4 py-2">₹{r.extraKmRate}</td>
                    <td className="px-4 py-2">₹{r.extraHrRate}</td>
                    <td className="px-4 py-2">₹{r.driverAllowance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Fares shown are the base rate card — your exact fare depends on pickup point and trip
            time. Pay the driver directly (cash or UPI) at the end of the trip; no advance needed.
          </p>
        </div>
      )}
    </div>
  );
}

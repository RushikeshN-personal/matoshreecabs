import Link from "next/link";
import type { Vehicle } from "@/lib/api/cabs";

export function CabCard({ cab }: { cab: Vehicle }) {
  const img = cab.images?.[0];
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-lg">
      <div
        className="h-44 w-full bg-gray-100 bg-cover bg-center"
        style={{
          backgroundImage: img
            ? `url(${img}), linear-gradient(120deg,#9a3412,#f97316)`
            : "linear-gradient(120deg,#9a3412,#f97316)",
        }}
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900">{cab.name}</h3>
        <p className="mt-1 text-sm text-gray-600">
          {cab.seating} seats · {cab.fuelType} · {cab.ac ? "AC" : "Non-AC"}
        </p>
        {cab.description && (
          <p className="mt-2 line-clamp-2 text-sm text-gray-500">{cab.description}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-1">
          {cab.features.slice(0, 3).map((f) => (
            <span key={f} className="rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-700">
              {f}
            </span>
          ))}
        </div>
        <Link
          href={`/cabs/${cab.id}`}
          className="mt-4 inline-block rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
import type { Metadata } from "next";
import { fetchCabs, type Vehicle } from "@/lib/api/cabs";
import { CabCard } from "@/components/cabs/cab-card";

export const metadata: Metadata = { title: "Our Cabs — Matoshree Cabs" };

export default async function CabsPage() {
  let cabs: Vehicle[] = [];
  try {
    cabs = await fetchCabs();
  } catch {
    cabs = [];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-6 border-l-4 border-orange-500 pl-3 text-3xl font-extrabold text-gray-900">
        Our Cabs
      </h1>

      {cabs.length === 0 ? (
        <p className="text-gray-600">
          No cabs available. Make sure the backend is running and seeded.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cabs.map((cab) => (
            <CabCard key={cab.id} cab={cab} />
          ))}
        </div>
      )}
    </div>
  );
}
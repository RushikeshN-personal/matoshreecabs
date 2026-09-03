"use client";

import { useEffect, useState } from "react";
import { fetchAllVehicles, upsertRateCard, type AdminVehicle } from "@/lib/api/admin-vehicles";

const inputCls =
  "w-32 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500";

function RentalRow({ vehicle, onSaved }: { vehicle: AdminVehicle; onSaved: () => void }) {
  const existing = vehicle.rateCards.find((r) => r.mode === "RENTAL");
  const [rate, setRate] = useState(existing?.baseRate ?? "0");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await upsertRateCard(vehicle.id, { mode: "RENTAL", baseRate: Number(rate) });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save rate");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div>
        <p className="font-semibold text-gray-900">{vehicle.name}</p>
        <p className="text-sm text-gray-500">
          {vehicle.seating} seats · {vehicle.fuelType}
        </p>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500">
          ₹
          <input
            type="number"
            min={0}
            className={inputCls}
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </label>
        <span className="text-xs text-gray-400">/ day</span>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

export function AdminRentalPricingPanel() {
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetchAllVehicles()
      .then((v) => setVehicles(v.filter((x) => x.status === "ACTIVE")))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-gray-900">Rental Pricing</h2>
      <p className="mb-4 text-sm text-gray-500">
        The daily rent shown on the home page's "Rent a Car" section, per vehicle. Customers
        message us on WhatsApp to book — there's no online rental checkout.
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading vehicles…</p>
      ) : vehicles.length === 0 ? (
        <p className="text-sm text-gray-500">No active vehicles.</p>
      ) : (
        <div className="space-y-2">
          {vehicles.map((v) => (
            <RentalRow key={v.id} vehicle={v} onSaved={load} />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { BOOKING_MODE_LABELS, PICKUP_LOCATIONS, DESTINATION_STOPS } from "@matoshreecabs/shared";
import { fetchAllVehicles, type AdminVehicle } from "@/lib/api/admin-vehicles";
import {
  deleteRouteFare,
  fetchRouteFares,
  upsertRouteFare,
  type RouteFare,
} from "@/lib/api/route-fares";

const MODES = ["PICK_DROP", "OUTSTATION", "LOCAL"] as const;

// Every city we either pick up from or have a named drop stop in, deduped.
const CITY_OPTIONS = Array.from(
  new Set([
    ...PICKUP_LOCATIONS.map((l) => l.city),
    ...DESTINATION_STOPS.map((s) => s.city),
  ]),
).sort();

const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500";

export function AdminRouteFaresPanel() {
  const [fares, setFares] = useState<RouteFare[]>([]);
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    vehicleId: "",
    mode: "OUTSTATION" as (typeof MODES)[number],
    fromCity: "Pune",
    toCity: "Mumbai",
    baseFare: 2500,
    tollCharge: 0,
    gstPercent: 0,
  });

  function load() {
    setLoading(true);
    Promise.all([fetchRouteFares(), fetchAllVehicles()])
      .then(([f, v]) => {
        setFares(f);
        setVehicles(v);
        if (!form.vehicleId && v[0]) setForm((prev) => ({ ...prev, vehicleId: v[0].id }));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await upsertRouteFare({
        ...form,
        toCity: form.mode === "LOCAL" ? form.fromCity : form.toCity,
      });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save route fare");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteRouteFare(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete route fare");
    }
  }

  const grouped = useMemo(() => {
    const map = new Map<string, RouteFare[]>();
    for (const f of fares) {
      const key = `${f.mode}:${f.fromCity} → ${f.toCity}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(f);
    }
    return map;
  }, [fares]);

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-gray-900">Route Fares</h2>
      <p className="mb-4 text-sm text-gray-500">
        The fixed fare (+ toll + GST) charged for a vehicle on a specific route. A route with no
        entry here shows customers a "get a quote on WhatsApp" prompt instead of a price.
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <form
        onSubmit={handleSave}
        className="mb-6 grid gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:grid-cols-3"
      >
        <label className="text-xs text-gray-500">
          Vehicle
          <select
            className={inputCls}
            value={form.vehicleId}
            onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
            required
          >
            <option value="" disabled>
              Select vehicle…
            </option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-gray-500">
          Mode
          <select
            className={inputCls}
            value={form.mode}
            onChange={(e) => setForm({ ...form, mode: e.target.value as (typeof MODES)[number] })}
          >
            {MODES.map((m) => (
              <option key={m} value={m}>
                {BOOKING_MODE_LABELS[m]}
              </option>
            ))}
          </select>
        </label>
        <div />

        <label className="text-xs text-gray-500">
          From city
          <select
            className={inputCls}
            value={form.fromCity}
            onChange={(e) => setForm({ ...form, fromCity: e.target.value })}
          >
            {CITY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-gray-500">
          To city {form.mode === "LOCAL" && <span>(same as From for Local)</span>}
          {form.mode === "LOCAL" ? (
            <input className={inputCls} value={form.fromCity} disabled />
          ) : (
            <select
              className={inputCls}
              value={form.toCity}
              onChange={(e) => setForm({ ...form, toCity: e.target.value })}
            >
              {CITY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </label>
        <div />

        <label className="text-xs text-gray-500">
          Base fare ₹
          <input
            type="number"
            min={0}
            className={inputCls}
            value={form.baseFare}
            onChange={(e) => setForm({ ...form, baseFare: Number(e.target.value) || 0 })}
          />
        </label>
        <label className="text-xs text-gray-500">
          Toll charge ₹
          <input
            type="number"
            min={0}
            className={inputCls}
            value={form.tollCharge}
            onChange={(e) => setForm({ ...form, tollCharge: Number(e.target.value) || 0 })}
          />
        </label>
        <label className="text-xs text-gray-500">
          GST %
          <input
            type="number"
            min={0}
            max={100}
            className={inputCls}
            value={form.gstPercent}
            onChange={(e) => setForm({ ...form, gstPercent: Number(e.target.value) || 0 })}
          />
        </label>

        <button
          type="submit"
          disabled={submitting || !form.vehicleId}
          className="sm:col-span-3 rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save route fare"}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-gray-500">Loading route fares…</p>
      ) : fares.length === 0 ? (
        <p className="text-sm text-gray-500">No route fares set yet — add one above.</p>
      ) : (
        <div className="space-y-4">
          {Array.from(grouped.entries()).map(([key, rows]) => (
            <div key={key} className="rounded-xl border border-gray-100 bg-white shadow-sm">
              <p className="border-b border-gray-100 px-4 py-2 text-sm font-semibold text-gray-900">
                {rows[0].fromCity} → {rows[0].toCity} · {BOOKING_MODE_LABELS[rows[0].mode]}
              </p>
              <div className="divide-y divide-gray-50">
                {rows.map((f) => (
                  <div
                    key={f.id}
                    className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-sm"
                  >
                    <span className="text-gray-700">
                      {f.vehicle.name}: ₹{f.baseFare}
                      {Number(f.tollCharge) > 0 && ` + ₹${f.tollCharge} toll`}
                      {Number(f.gstPercent) > 0 && ` + ${f.gstPercent}% GST`}
                      {!f.active && <span className="ml-2 text-red-600">(inactive)</span>}
                    </span>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

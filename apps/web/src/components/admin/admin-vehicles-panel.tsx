"use client";

import { useEffect, useState } from "react";
import { BOOKING_MODE_LABELS } from "@matoshreecabs/shared";
import {
  createVehicle,
  fetchAllVehicles,
  setVehicleStatus,
  updateVehicle,
  upsertRateCard,
  type AdminVehicle,
} from "@/lib/api/admin-vehicles";

const MODES = ["PICK_DROP", "OUTSTATION", "LOCAL", "RENTAL"] as const;

const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500";

function RateCardEditor({ vehicle, onSaved }: { vehicle: AdminVehicle; onSaved: () => void }) {
  const [mode, setMode] = useState<(typeof MODES)[number]>("LOCAL");
  const existing = vehicle.rateCards.find((r) => r.mode === mode);
  const [packageKm, setPackageKm] = useState(existing?.packageKm ?? 300);
  const [baseRate, setBaseRate] = useState(existing?.baseRate ?? "0");
  const [extraKmRate, setExtraKmRate] = useState(existing?.extraKmRate ?? "0");
  const [extraHrRate, setExtraHrRate] = useState(existing?.extraHrRate ?? "0");
  const [driverAllowance, setDriverAllowance] = useState(existing?.driverAllowance ?? "0");
  const [nightCharge, setNightCharge] = useState(existing?.nightCharge ?? "0");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const rc = vehicle.rateCards.find((r) => r.mode === mode);
    setPackageKm(rc?.packageKm ?? 300);
    setBaseRate(rc?.baseRate ?? "0");
    setExtraKmRate(rc?.extraKmRate ?? "0");
    setExtraHrRate(rc?.extraHrRate ?? "0");
    setDriverAllowance(rc?.driverAllowance ?? "0");
    setNightCharge(rc?.nightCharge ?? "0");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, vehicle]);

  async function handleSave() {
    setSaving(true);
    try {
      await upsertRateCard(vehicle.id, {
        mode,
        packageKm: Number(packageKm),
        baseRate: Number(baseRate),
        extraKmRate: Number(extraKmRate),
        extraHrRate: Number(extraHrRate),
        driverAllowance: Number(driverAllowance),
        nightCharge: Number(nightCharge),
      });
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-3 rounded-lg bg-gray-50 p-3">
      <div className="mb-2 flex flex-wrap gap-1">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={
              "rounded-full px-2 py-1 text-xs font-semibold " +
              (mode === m ? "bg-orange-600 text-white" : "bg-white text-orange-700 border border-orange-200")
            }
          >
            {BOOKING_MODE_LABELS[m]}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
        <label className="text-xs text-gray-500">
          Package km
          <input
            className={inputCls}
            type="number"
            value={packageKm}
            onChange={(e) => setPackageKm(Number(e.target.value) || 0)}
          />
        </label>
        <label className="text-xs text-gray-500">
          Base ₹
          <input
            className={inputCls}
            type="number"
            value={baseRate}
            onChange={(e) => setBaseRate(e.target.value)}
          />
        </label>
        <label className="text-xs text-gray-500">
          Extra/km ₹
          <input
            className={inputCls}
            type="number"
            value={extraKmRate}
            onChange={(e) => setExtraKmRate(e.target.value)}
          />
        </label>
        <label className="text-xs text-gray-500">
          Extra/hr ₹
          <input
            className={inputCls}
            type="number"
            value={extraHrRate}
            onChange={(e) => setExtraHrRate(e.target.value)}
          />
        </label>
        <label className="text-xs text-gray-500">
          Driver allowance ₹
          <input
            className={inputCls}
            type="number"
            value={driverAllowance}
            onChange={(e) => setDriverAllowance(e.target.value)}
          />
        </label>
        <label className="text-xs text-gray-500">
          Night charge ₹
          <input
            className={inputCls}
            type="number"
            value={nightCharge}
            onChange={(e) => setNightCharge(e.target.value)}
          />
        </label>
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-2 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
      >
        {saving ? "Saving…" : `Save ${BOOKING_MODE_LABELS[mode]} rate`}
      </button>
    </div>
  );
}

function VehicleDetailsEditor({ vehicle, onSaved }: { vehicle: AdminVehicle; onSaved: () => void }) {
  const [name, setName] = useState(vehicle.name);
  const [description, setDescription] = useState(vehicle.description ?? "");
  const [seating, setSeating] = useState(vehicle.seating);
  const [luggage, setLuggage] = useState(vehicle.luggage);
  const [fuelType, setFuelType] = useState(vehicle.fuelType);
  const [ac, setAc] = useState(vehicle.ac);
  const [features, setFeatures] = useState(vehicle.features.join(", "));
  const [images, setImages] = useState(vehicle.images.join(", "));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await updateVehicle(vehicle.id, {
        name,
        description: description || undefined,
        seating,
        luggage,
        fuelType,
        ac,
        features: features.split(",").map((f) => f.trim()).filter(Boolean),
        images: images.split(",").map((f) => f.trim()).filter(Boolean),
      });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save vehicle details");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-3 space-y-2 rounded-lg bg-gray-50 p-3">
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs text-gray-500">
          Name
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="text-xs text-gray-500">
          Fuel type
          <input className={inputCls} value={fuelType} onChange={(e) => setFuelType(e.target.value)} />
        </label>
        <label className="text-xs text-gray-500">
          Seating
          <input
            className={inputCls}
            type="number"
            min={1}
            value={seating}
            onChange={(e) => setSeating(Number(e.target.value) || 1)}
          />
        </label>
        <label className="text-xs text-gray-500">
          Luggage
          <input
            className={inputCls}
            type="number"
            min={0}
            value={luggage}
            onChange={(e) => setLuggage(Number(e.target.value) || 0)}
          />
        </label>
      </div>
      <label className="block text-xs text-gray-500">
        Description
        <textarea
          className={inputCls}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A short paragraph shown on the cab's page…"
        />
      </label>
      <label className="block text-xs text-gray-500">
        Features (comma-separated)
        <input className={inputCls} value={features} onChange={(e) => setFeatures(e.target.value)} />
      </label>
      <label className="block text-xs text-gray-500">
        Image URLs (comma-separated)
        <input className={inputCls} value={images} onChange={(e) => setImages(e.target.value)} />
      </label>
      <label className="flex items-center gap-2 text-xs text-gray-600">
        <input type="checkbox" checked={ac} onChange={(e) => setAc(e.target.checked)} />
        AC
      </label>
      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save details"}
      </button>
    </div>
  );
}

export function AdminVehiclesPanel() {
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRates, setExpandedRates] = useState<string | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    seating: 4,
    luggage: 2,
    fuelType: "Petrol",
  });

  function load() {
    setLoading(true);
    fetchAllVehicles()
      .then(setVehicles)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createVehicle({ ...form, description: form.description || undefined });
      setForm({ name: "", description: "", seating: 4, luggage: 2, fuelType: "Petrol" });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create vehicle");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleStatus(v: AdminVehicle) {
    try {
      await setVehicleStatus(v.id, v.status !== "ACTIVE");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status");
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Vehicles & Rate Cards</h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="rounded-lg bg-orange-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-700"
        >
          {showForm ? "Cancel" : "Add vehicle"}
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 grid gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:grid-cols-2"
        >
          <input
            className={inputCls}
            placeholder="Name (e.g. Sedan)"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="Fuel type"
            required
            value={form.fuelType}
            onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
          />
          <input
            className={inputCls}
            type="number"
            min={1}
            placeholder="Seating"
            value={form.seating}
            onChange={(e) => setForm({ ...form, seating: Number(e.target.value) || 1 })}
          />
          <input
            className={inputCls}
            type="number"
            min={0}
            placeholder="Luggage"
            value={form.luggage}
            onChange={(e) => setForm({ ...form, luggage: Number(e.target.value) || 0 })}
          />
          <textarea
            className={`${inputCls} sm:col-span-2`}
            rows={2}
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button
            type="submit"
            disabled={submitting}
            className="sm:col-span-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60"
          >
            {submitting ? "Creating…" : "Create vehicle"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading vehicles…</p>
      ) : (
        <div className="space-y-2">
          {vehicles.map((v) => (
            <div key={v.id} className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900">{v.name}</p>
                  <p className="text-sm text-gray-500">
                    {v.seating} seats · {v.luggage} luggage · {v.fuelType} ·{" "}
                    {v.rateCards.length} rate card(s)
                  </p>
                  {v.description && (
                    <p className="mt-1 max-w-xl text-xs text-gray-400 line-clamp-1">
                      {v.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={
                      "rounded-full px-2 py-0.5 text-xs font-semibold " +
                      (v.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")
                    }
                  >
                    {v.status === "ACTIVE" ? "Active" : "Disabled"}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(v)}
                    className="rounded-lg border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    {v.status === "ACTIVE" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => setExpandedDetails(expandedDetails === v.id ? null : v.id)}
                    className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    {expandedDetails === v.id ? "Hide details" : "Edit details"}
                  </button>
                  <button
                    onClick={() => setExpandedRates(expandedRates === v.id ? null : v.id)}
                    className="rounded-lg bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 hover:bg-orange-100"
                  >
                    {expandedRates === v.id ? "Hide rates" : "Edit rates"}
                  </button>
                </div>
              </div>
              {expandedDetails === v.id && <VehicleDetailsEditor vehicle={v} onSaved={load} />}
              {expandedRates === v.id && <RateCardEditor vehicle={v} onSaved={load} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

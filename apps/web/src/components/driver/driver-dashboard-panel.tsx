"use client";

import { useEffect, useState } from "react";
import { BOOKING_MODE_LABELS } from "@matoshreecabs/shared";
import {
  cancelTrip,
  completeTrip,
  fetchDriverStats,
  fetchDriverTrips,
  startTrip,
  type DriverStats,
  type DriverTrip,
} from "@/lib/api/driver";

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Confirmed — upcoming",
  ONGOING: "Ongoing",
};

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-gray-900">{value}</p>
    </div>
  );
}

function CompleteTripForm({ trip, onDone }: { trip: DriverTrip; onDone: () => void }) {
  const [amount, setAmount] = useState(trip.total);
  const [method, setMethod] = useState<"CASH" | "UPI">("CASH");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleComplete() {
    setSaving(true);
    setError(null);
    try {
      await completeTrip(trip.id, Number(amount), method);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete trip");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-3 rounded-lg bg-gray-50 p-3">
      {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
      <div className="flex flex-wrap items-end gap-2">
        <label className="text-xs text-gray-500">
          Amount collected ₹
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-28 rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="text-xs text-gray-500">
          Method
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as "CASH" | "UPI")}
            className="mt-1 block rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
          >
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
          </select>
        </label>
        <button
          onClick={handleComplete}
          disabled={saving}
          className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Mark completed & closed"}
        </button>
      </div>
    </div>
  );
}

export function DriverDashboardPanel() {
  const [stats, setStats] = useState<DriverStats | null>(null);
  const [trips, setTrips] = useState<DriverTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    Promise.all([fetchDriverStats(), fetchDriverTrips()])
      .then(([s, t]) => {
        setStats(s);
        setTrips(t);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleStart(id: string) {
    setBusyId(id);
    try {
      await startTrip(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start trip");
    } finally {
      setBusyId(null);
    }
  }

  async function handleCancel(id: string) {
    const reason = window.prompt("Reason for cancelling this trip?");
    if (!reason) return;
    setBusyId(id);
    try {
      await cancelTrip(id, reason);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel trip");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-gray-900">My Dashboard</h1>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatCard label="Total trips" value={stats.totalTrips} />
          <StatCard label="Completed" value={stats.completedTrips} />
          <StatCard label="Ongoing" value={stats.ongoingTrips} />
          <StatCard label="Upcoming" value={stats.upcomingTrips} />
          <StatCard label="Total collected" value={`₹${stats.totalCollected}`} />
        </div>
      )}

      <h2 className="mb-3 text-lg font-bold text-gray-900">Assigned trips</h2>

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : trips.length === 0 ? (
        <p className="text-sm text-gray-500">No confirmed or ongoing trips right now.</p>
      ) : (
        <div className="space-y-2">
          {trips.map((t) => (
            <div key={t.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-xs text-gray-400">{t.ref}</p>
                  <p className="font-semibold text-gray-900">
                    {BOOKING_MODE_LABELS[t.mode] ?? t.mode}
                    {t.destination ? ` · ${t.pickup} → ${t.destination}` : ` · ${t.pickup}`}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(t.dateTime).toLocaleString()} · {t.vehicle?.name ?? "—"} ·{" "}
                    {t.passengers} pax
                  </p>
                  {t.customer && (
                    <p className="mt-1 text-sm text-gray-700">
                      Rider: <span className="font-medium">{t.customer.name}</span> ·{" "}
                      {t.customer.mobile}
                    </p>
                  )}
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                  {STATUS_LABELS[t.status] ?? t.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">Est. ₹{t.total}</span>
                {t.status === "CONFIRMED" && (
                  <button
                    onClick={() => handleStart(t.id)}
                    disabled={busyId === t.id}
                    className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
                  >
                    Start trip
                  </button>
                )}
                {t.status === "ONGOING" && completingId !== t.id && (
                  <button
                    onClick={() => setCompletingId(t.id)}
                    className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                  >
                    Complete trip
                  </button>
                )}
                <button
                  onClick={() => handleCancel(t.id)}
                  disabled={busyId === t.id}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>

              {completingId === t.id && (
                <CompleteTripForm
                  trip={t}
                  onDone={() => {
                    setCompletingId(null);
                    load();
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

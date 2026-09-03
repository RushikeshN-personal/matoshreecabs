"use client";

import { useEffect, useState } from "react";
import { BOOKING_MODE_LABELS } from "@matoshreecabs/shared";
import { fetchDriverHistory, type DriverTrip } from "@/lib/api/driver";

export function DriverHistoryPanel() {
  const [trips, setTrips] = useState<DriverTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDriverHistory()
      .then(setTrips)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-gray-900">Trip History</h1>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : trips.length === 0 ? (
        <p className="text-sm text-gray-500">No completed trips yet.</p>
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
                    {new Date(t.dateTime).toLocaleString()} · {t.vehicle?.name ?? "—"}
                  </p>
                  {t.customer && (
                    <p className="mt-1 text-sm text-gray-700">{t.customer.name}</p>
                  )}
                </div>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {t.status}
                </span>
              </div>
              {t.payment && (
                <p className="mt-2 text-sm text-gray-700">
                  Collected: <span className="font-semibold">₹{t.payment.amount}</span> (
                  {t.payment.method})
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

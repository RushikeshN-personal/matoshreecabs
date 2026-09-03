"use client";

import { useEffect, useState } from "react";
import { BOOKING_MODE_LABELS } from "@matoshreecabs/shared";
import {
  adminCancelBooking,
  assignDriverToBooking,
  confirmBooking,
  fetchAllBookings,
  type AdminBooking,
} from "@/lib/api/admin-bookings";
import { fetchDrivers, type AdminDriver } from "@/lib/api/admin-drivers";

const STATUS_FILTERS = [
  "ALL",
  "REQUESTED",
  "DRIVER_ASSIGNED",
  "CONFIRMED",
  "ONGOING",
  "COMPLETED",
  "CLOSED",
  "NEEDS_REASSIGNMENT",
  "CANCELLED",
];

const STATUS_LABELS: Record<string, string> = {
  REQUESTED: "Requested",
  DRIVER_ASSIGNED: "Driver assigned",
  CONFIRMED: "Confirmed",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  CLOSED: "Closed",
  NEEDS_REASSIGNMENT: "Needs reassignment",
  CANCELLED: "Cancelled",
};

function statusTone(status: string) {
  if (status === "CANCELLED") return "bg-red-50 text-red-700";
  if (status === "CLOSED" || status === "COMPLETED") return "bg-green-50 text-green-700";
  if (status === "NEEDS_REASSIGNMENT") return "bg-yellow-50 text-yellow-700";
  return "bg-orange-50 text-orange-700";
}

export function AdminBookingsPanel() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [drivers, setDrivers] = useState<AdminDriver[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [driverPick, setDriverPick] = useState<Record<string, string>>({});

  function load() {
    setLoading(true);
    Promise.all([
      fetchAllBookings(filter === "ALL" ? undefined : filter),
      fetchDrivers(),
    ])
      .then(([b, d]) => {
        setBookings(b);
        setDrivers(d.filter((driver) => driver.status === "ACTIVE"));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function handleAssign(id: string) {
    const driverId = driverPick[id];
    if (!driverId) return;
    setBusyId(id);
    try {
      const updated = await assignDriverToBooking(id, driverId);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not assign driver");
    } finally {
      setBusyId(null);
    }
  }

  async function handleConfirm(id: string) {
    setBusyId(id);
    try {
      const updated = await confirmBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not confirm booking");
    } finally {
      setBusyId(null);
    }
  }

  async function handleCancel(id: string) {
    setBusyId(id);
    try {
      const updated = await adminCancelBooking(id, "Cancelled by admin");
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not cancel booking");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={
              "rounded-full px-3 py-1 text-xs font-semibold transition-colors " +
              (filter === s
                ? "bg-orange-600 text-white"
                : "bg-orange-50 text-orange-700 hover:bg-orange-100")
            }
          >
            {s === "ALL" ? "All" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading bookings…</p>
      ) : bookings.length === 0 ? (
        <p className="text-sm text-gray-500">No bookings in this filter.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => {
            const rider = b.customer ?? { name: b.guestName, mobile: b.guestMobile };
            return (
              <div key={b.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs text-gray-400">{b.ref}</p>
                    <p className="font-semibold text-gray-900">
                      {BOOKING_MODE_LABELS[b.mode] ?? b.mode}
                      {b.destination ? ` · ${b.pickup} → ${b.destination}` : ` · ${b.pickup}`}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(b.dateTime).toLocaleString()} · {b.vehicle?.name ?? "Cab TBD"} ·{" "}
                      {b.passengers} pax
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      Rider: <span className="font-medium">{rider.name ?? "—"}</span> ·{" "}
                      {rider.mobile ?? "—"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(b.status)}`}
                  >
                    {STATUS_LABELS[b.status] ?? b.status}
                  </span>
                </div>

                {b.driver && (
                  <p className="mt-2 text-sm text-gray-700">
                    Driver: <span className="font-medium">{b.driver.user.name}</span> ·{" "}
                    {b.driver.user.mobile}
                  </p>
                )}

                {(b.gstNumber || b.flightNumber || b.trainNumber) && (
                  <p className="mt-1 text-xs text-gray-500">
                    {b.gstNumber && <>GST: {b.gstNumber} </>}
                    {b.flightNumber && <>· Flight: {b.flightNumber} </>}
                    {b.trainNumber && <>· Train: {b.trainNumber}</>}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {Number(b.total) > 0 ? (
                    <span className="text-sm font-semibold text-gray-900">₹{b.total}</span>
                  ) : (
                    <span className="text-sm font-semibold text-orange-600">
                      Fare pending — confirm on WhatsApp
                    </span>
                  )}

                  {(b.status === "REQUESTED" || b.status === "NEEDS_REASSIGNMENT") && (
                    <>
                      <select
                        value={driverPick[b.id] ?? ""}
                        onChange={(e) =>
                          setDriverPick((prev) => ({ ...prev, [b.id]: e.target.value }))
                        }
                        className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs"
                      >
                        <option value="">Select driver…</option>
                        {drivers.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.user.name} ({d.availability === "AVAILABLE" ? "free" : "off-duty"})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAssign(b.id)}
                        disabled={busyId === b.id || !driverPick[b.id]}
                        className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
                      >
                        Assign driver
                      </button>
                    </>
                  )}

                  {b.status === "DRIVER_ASSIGNED" && (
                    <button
                      onClick={() => handleConfirm(b.id)}
                      disabled={busyId === b.id}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Confirm booking
                    </button>
                  )}

                  {["REQUESTED", "DRIVER_ASSIGNED", "CONFIRMED", "NEEDS_REASSIGNMENT"].includes(
                    b.status,
                  ) && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      disabled={busyId === b.id}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}

                  {b.payment && (
                    <span className="text-xs text-gray-500">
                      Collected: ₹{b.payment.amount} ({b.payment.method})
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

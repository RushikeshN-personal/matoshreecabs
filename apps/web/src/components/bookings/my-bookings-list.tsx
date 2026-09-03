"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BOOKING_MODE_LABELS } from "@matoshreecabs/shared";
import { cancelBooking, fetchMyBookings, type Booking } from "@/lib/api/bookings";
import { useAuth } from "@/lib/auth/use-auth";

const STATUS_LABELS: Record<string, string> = {
  REQUESTED: "Requested",
  DRIVER_ASSIGNED: "Driver assigned",
  CONFIRMED: "Confirmed",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  CLOSED: "Closed",
  NEEDS_REASSIGNMENT: "Reassigning driver",
  CANCELLED: "Cancelled",
};

const CANCELLABLE = new Set(["REQUESTED", "DRIVER_ASSIGNED", "CONFIRMED"]);

function statusTone(status: string) {
  if (status === "CANCELLED") return "bg-red-50 text-red-700";
  if (status === "CLOSED" || status === "COMPLETED") return "bg-green-50 text-green-700";
  if (status === "NEEDS_REASSIGNMENT") return "bg-yellow-50 text-yellow-700";
  return "bg-orange-50 text-orange-700";
}

export function MyBookingsList() {
  const { user, ready } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !user) return;
    fetchMyBookings()
      .then(setBookings)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load bookings"))
      .finally(() => setLoading(false));
  }, [ready, user]);

  async function handleCancel(id: string) {
    setCancellingId(id);
    try {
      const updated = await cancelBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not cancel booking");
    } finally {
      setCancellingId(null);
    }
  }

  if (!ready) return null;

  if (!user) {
    return (
      <p className="text-sm text-gray-600">
        Please{" "}
        <Link href="/login" className="font-semibold text-orange-700 underline">
          log in
        </Link>{" "}
        to see your bookings.
      </p>
    );
  }

  if (loading) return <p className="text-sm text-gray-500">Loading your bookings…</p>;

  if (error) return <p className="text-sm text-red-600">{error}</p>;

  if (bookings.length === 0) {
    return (
      <p className="text-sm text-gray-600">
        No bookings yet.{" "}
        <Link href="/" className="font-semibold text-orange-700 underline">
          Book a ride
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <div key={b.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-mono text-xs text-gray-400">{b.ref}</p>
              <p className="font-semibold text-gray-900">
                {BOOKING_MODE_LABELS[b.mode] ?? b.mode}
                {b.destination ? ` · ${b.pickup} → ${b.destination}` : ` · ${b.pickup}`}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {new Date(b.dateTime).toLocaleString()} · {b.vehicle?.name ?? "Cab TBD"}
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

          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Estimated fare: <span className="font-semibold">₹{b.total}</span>{" "}
              <span className="text-gray-400">(pay driver directly)</span>
            </p>
            {CANCELLABLE.has(b.status) && (
              <button
                onClick={() => handleCancel(b.id)}
                disabled={cancellingId === b.id}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                {cancellingId === b.id ? "Cancelling…" : "Cancel"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BOOKING_MODE_LABELS } from "@matoshreecabs/shared";
import { cancelGuestBooking, trackBooking, type Booking } from "@/lib/api/bookings";

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

export function TrackBookingForm() {
  const params = useSearchParams();
  const [ref, setRef] = useState(params.get("ref") ?? "");
  const [mobile, setMobile] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialRef = params.get("ref");
    if (initialRef) setRef(initialRef);
  }, [params]);

  async function handleLookup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await trackBooking(ref.trim(), mobile.trim());
      setBooking(result);
    } catch (err) {
      setBooking(null);
      setError(err instanceof Error ? err.message : "Booking not found.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!booking) return;
    setLoading(true);
    try {
      const updated = await cancelGuestBooking(ref.trim(), mobile.trim());
      setBooking(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel booking.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <form onSubmit={handleLookup} className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Booking reference
          </label>
          <input
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="AC-XXXXX-XXXXX"
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Mobile number</label>
          <input
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10-digit mobile used at booking"
            inputMode="numeric"
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60"
        >
          {loading ? "Looking up…" : "Find booking"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      {booking && (
        <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="font-mono text-xs text-gray-400">{booking.ref}</p>
          <p className="mt-1 font-semibold text-gray-900">
            {BOOKING_MODE_LABELS[booking.mode] ?? booking.mode}
            {booking.destination ? ` · ${booking.pickup} → ${booking.destination}` : ` · ${booking.pickup}`}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {new Date(booking.dateTime).toLocaleString()} · {booking.vehicle?.name ?? "Cab TBD"}
          </p>
          <p className="mt-2 text-sm font-semibold text-orange-700">
            {STATUS_LABELS[booking.status] ?? booking.status}
          </p>
          {booking.driver && (
            <p className="mt-2 text-sm text-gray-700">
              Driver: <span className="font-medium">{booking.driver.user.name}</span> ·{" "}
              {booking.driver.user.mobile}
            </p>
          )}
          <p className="mt-2 text-sm text-gray-700">
            Estimated fare: <span className="font-semibold">₹{booking.total}</span>{" "}
            <span className="text-gray-400">(pay driver directly)</span>
          </p>
          {CANCELLABLE.has(booking.status) && (
            <button
              onClick={handleCancel}
              disabled={loading}
              className="mt-3 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              Cancel booking
            </button>
          )}
        </div>
      )}
    </div>
  );
}

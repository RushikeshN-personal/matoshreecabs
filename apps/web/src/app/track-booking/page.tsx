import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackBookingForm } from "@/components/bookings/track-booking-form";

export const metadata: Metadata = { title: "Track Booking — Matoshree Cabs" };

export default function TrackBookingPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-orange-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Track a Booking</h1>
          <p className="mt-2 text-gray-600">
            No account needed — look up your ride with the reference and mobile number you booked with.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-10">
        <Suspense>
          <TrackBookingForm />
        </Suspense>
      </section>
    </div>
  );
}

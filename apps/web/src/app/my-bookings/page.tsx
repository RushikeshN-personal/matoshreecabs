import type { Metadata } from "next";
import { MyBookingsList } from "@/components/bookings/my-bookings-list";

export const metadata: Metadata = { title: "My Bookings — Matoshree Cabs" };

export default function MyBookingsPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-orange-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="text-3xl font-extrabold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-gray-600">Track your ride requests and trip history.</p>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-10">
        <MyBookingsList />
      </section>
    </div>
  );
}

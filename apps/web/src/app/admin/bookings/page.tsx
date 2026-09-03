import type { Metadata } from "next";
import { AdminBookingsPanel } from "@/components/admin/admin-bookings-panel";

export const metadata: Metadata = { title: "Bookings — Admin — Matoshree Cabs" };

export default function AdminBookingsPage() {
  return <AdminBookingsPanel />;
}

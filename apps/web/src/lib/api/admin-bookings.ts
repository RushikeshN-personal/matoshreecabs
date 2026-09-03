import { apiFetch } from "@/lib/api/client";
import type { Booking } from "@/lib/api/bookings";

export interface AdminBooking extends Booking {
  customer: { name: string; mobile: string; email: string } | null;
  guestName?: string | null;
  guestMobile?: string | null;
}

export function fetchAllBookings(status?: string): Promise<AdminBooking[]> {
  const qs = status ? `?status=${status}` : "";
  return apiFetch<AdminBooking[]>(`/admin/bookings${qs}`, { auth: true });
}

export function assignDriverToBooking(id: string, driverId: string): Promise<AdminBooking> {
  return apiFetch<AdminBooking>(`/admin/bookings/${id}/assign-driver`, {
    method: "POST",
    body: { driverId },
    auth: true,
  });
}

export function confirmBooking(id: string): Promise<AdminBooking> {
  return apiFetch<AdminBooking>(`/admin/bookings/${id}/confirm`, {
    method: "POST",
    auth: true,
  });
}

export function adminCancelBooking(id: string, reason?: string): Promise<AdminBooking> {
  return apiFetch<AdminBooking>(`/admin/bookings/${id}/cancel`, {
    method: "POST",
    body: { reason },
    auth: true,
  });
}

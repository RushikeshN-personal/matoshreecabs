import { apiFetch } from "@/lib/api/client";

export interface BookingCreateInput {
  mode: string;
  vehicleId: string;
  pickupLocationId?: string;
  destination?: string;
  destinationCity?: string;
  tripType?: "ONE_WAY" | "ROUND_TRIP";
  dateTime: string; // ISO
  returnDateTime?: string; // ISO
  passengers?: number;
  riderName: string;
  riderMobile: string;
  riderEmail?: string;
  gstNumber?: string;
  flightNumber?: string;
  trainNumber?: string;
}

export interface Booking {
  id: string;
  ref: string;
  mode: string;
  pickup: string;
  destination: string | null;
  tripType: string | null;
  dateTime: string;
  returnDateTime: string | null;
  passengers: number;
  gstNumber?: string | null;
  flightNumber?: string | null;
  trainNumber?: string | null;
  total: string;
  status: string;
  fareBreakdown: Record<string, number> | null;
  vehicle: { id: string; name: string } | null;
  driver: { id: string; user: { name: string; mobile: string } } | null;
  payment: { amount: string; method: string } | null;
  createdAt: string;
}

export function createBooking(input: BookingCreateInput): Promise<Booking> {
  return apiFetch<Booking>("/bookings", { method: "POST", body: input, auth: true });
}

export function fetchMyBookings(): Promise<Booking[]> {
  return apiFetch<Booking[]>("/bookings", { auth: true });
}

export function fetchMyBooking(id: string): Promise<Booking> {
  return apiFetch<Booking>(`/bookings/${id}`, { auth: true });
}

export function cancelBooking(id: string, reason?: string): Promise<Booking> {
  return apiFetch<Booking>(`/bookings/${id}/cancel`, {
    method: "POST",
    body: { reason },
    auth: true,
  });
}

// Guest self-service — no login, identified by ref + the mobile number the
// booking was made with.
export function trackBooking(ref: string, mobile: string): Promise<Booking> {
  const params = new URLSearchParams({ ref, mobile });
  return apiFetch<Booking>(`/bookings/track?${params.toString()}`);
}

export function cancelGuestBooking(ref: string, mobile: string, reason?: string): Promise<Booking> {
  return apiFetch<Booking>("/bookings/track/cancel", {
    method: "POST",
    body: { ref, mobile, reason },
  });
}

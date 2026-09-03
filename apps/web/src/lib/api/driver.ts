import { apiFetch } from "@/lib/api/client";

export interface DriverStats {
  totalTrips: number;
  completedTrips: number;
  ongoingTrips: number;
  upcomingTrips: number;
  cancelledByMe: number;
  totalCollected: number;
}

export interface DriverTrip {
  id: string;
  ref: string;
  mode: string;
  pickup: string;
  destination: string | null;
  dateTime: string;
  passengers: number;
  total: string;
  status: string;
  customer: { name: string; mobile: string } | null;
  vehicle: { id: string; name: string } | null;
  payment: { amount: string; method: string } | null;
}

export function fetchDriverStats(): Promise<DriverStats> {
  return apiFetch<DriverStats>("/driver/stats", { auth: true });
}

export function fetchDriverTrips(): Promise<DriverTrip[]> {
  return apiFetch<DriverTrip[]>("/driver/trips", { auth: true });
}

export function fetchDriverHistory(): Promise<DriverTrip[]> {
  return apiFetch<DriverTrip[]>("/driver/history", { auth: true });
}

export function startTrip(id: string): Promise<DriverTrip> {
  return apiFetch<DriverTrip>(`/driver/trips/${id}/start`, { method: "POST", auth: true });
}

export function completeTrip(
  id: string,
  amount: number,
  method: "CASH" | "UPI",
): Promise<DriverTrip> {
  return apiFetch<DriverTrip>(`/driver/trips/${id}/complete`, {
    method: "POST",
    body: { amount, method },
    auth: true,
  });
}

export function cancelTrip(id: string, reason: string): Promise<DriverTrip> {
  return apiFetch<DriverTrip>(`/driver/trips/${id}/cancel`, {
    method: "POST",
    body: { reason },
    auth: true,
  });
}

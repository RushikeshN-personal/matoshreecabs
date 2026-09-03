import { apiFetch } from "@/lib/api/client";

export interface FareBreakdown {
  baseFare: number;
  tollCharge: number;
  gstPercent: number;
  gstAmount: number;
  total: number;
}

export type FareQuoteResult =
  | { found: true; fare: FareBreakdown }
  | { found: false };

export function quoteFare(params: {
  vehicleId: string;
  mode: string;
  fromCity: string;
  toCity?: string;
}): Promise<FareQuoteResult> {
  const qs = new URLSearchParams({
    vehicleId: params.vehicleId,
    mode: params.mode,
    fromCity: params.fromCity,
    ...(params.toCity ? { toCity: params.toCity } : {}),
  });
  return apiFetch<FareQuoteResult>(`/fares/quote?${qs.toString()}`);
}

export interface RouteFare {
  id: string;
  vehicleId: string;
  mode: "PICK_DROP" | "OUTSTATION" | "LOCAL";
  fromCity: string;
  toCity: string;
  baseFare: string;
  tollCharge: string;
  gstPercent: string;
  active: boolean;
  vehicle: { name: string };
}

export interface RouteFareUpsertInput {
  vehicleId: string;
  mode: "PICK_DROP" | "OUTSTATION" | "LOCAL";
  fromCity: string;
  toCity: string;
  baseFare: number;
  tollCharge?: number;
  gstPercent?: number;
  active?: boolean;
}

export function fetchRouteFares(): Promise<RouteFare[]> {
  return apiFetch<RouteFare[]>("/admin/route-fares", { auth: true });
}

export function upsertRouteFare(input: RouteFareUpsertInput): Promise<RouteFare> {
  return apiFetch<RouteFare>("/admin/route-fares", { method: "POST", body: input, auth: true });
}

export function deleteRouteFare(id: string) {
  return apiFetch(`/admin/route-fares/${id}`, { method: "DELETE", auth: true });
}

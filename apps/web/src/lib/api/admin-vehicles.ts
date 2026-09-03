import { apiFetch } from "@/lib/api/client";
import type { RateCard, VehicleDetail } from "@/lib/api/cabs";

export interface AdminVehicle extends VehicleDetail {
  status: "ACTIVE" | "DISABLED";
  rateCards: RateCard[];
}

export interface VehicleCreateInput {
  name: string;
  description?: string;
  seating: number;
  luggage?: number;
  ac?: boolean;
  fuelType: string;
  features?: string[];
  images?: string[];
}

export interface RateCardInput {
  mode: "PICK_DROP" | "OUTSTATION" | "LOCAL" | "RENTAL";
  packageKm?: number;
  baseRate: number;
  extraKmRate?: number;
  extraHrRate?: number;
  driverAllowance?: number;
  nightCharge?: number;
}

export function fetchAllVehicles(): Promise<AdminVehicle[]> {
  return apiFetch<AdminVehicle[]>("/admin/cabs", { auth: true });
}

export function createVehicle(input: VehicleCreateInput) {
  return apiFetch("/admin/cabs", { method: "POST", body: input, auth: true });
}

export function updateVehicle(id: string, input: Partial<VehicleCreateInput>) {
  return apiFetch(`/admin/cabs/${id}`, { method: "PATCH", body: input, auth: true });
}

export function setVehicleStatus(id: string, active: boolean) {
  return apiFetch(`/admin/cabs/${id}/${active ? "activate" : "deactivate"}`, {
    method: "PATCH",
    auth: true,
  });
}

export function upsertRateCard(id: string, input: RateCardInput) {
  return apiFetch(`/admin/cabs/${id}/rate-card`, { method: "POST", body: input, auth: true });
}

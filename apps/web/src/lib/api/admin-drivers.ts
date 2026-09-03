import { apiFetch } from "@/lib/api/client";

export interface AdminDriver {
  id: string;
  userId: string;
  licenceNo: string;
  location: string | null;
  languages: string[];
  experienceYrs: number;
  rating: number;
  availability: "AVAILABLE" | "OFF_DUTY";
  status: "ACTIVE" | "DISABLED";
  assignedCabId: string | null;
  user: { name: string; email: string; mobile: string; status: string };
}

// No password field — one is generated server-side and emailed to the driver.
export interface DriverCreateInput {
  name: string;
  email: string;
  mobile: string;
  location?: string;
  licenceNo: string;
  languages?: string[];
  experienceYrs?: number;
  assignedCabId?: string;
}

export function fetchDrivers(): Promise<AdminDriver[]> {
  return apiFetch<AdminDriver[]>("/admin/drivers", { auth: true });
}

export function createDriver(input: DriverCreateInput) {
  return apiFetch("/admin/drivers", { method: "POST", body: input, auth: true });
}

export function deactivateDriver(userId: string) {
  return apiFetch(`/admin/drivers/${userId}/deactivate`, { method: "PATCH", auth: true });
}

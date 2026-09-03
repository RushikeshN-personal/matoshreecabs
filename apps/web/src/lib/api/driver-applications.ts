import { apiFetch } from "./client";
import type { DriverApplicationInput } from "@matoshreecabs/shared";

export function submitDriverApplication(input: DriverApplicationInput) {
  return apiFetch<{ ok: boolean }>("/driver-applications", {
    method: "POST",
    body: input,
  });
}

export interface DriverApplication extends DriverApplicationInput {
  id: string;
  status: "NEW" | "REVIEWING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export function fetchDriverApplications(): Promise<DriverApplication[]> {
  return apiFetch<DriverApplication[]>("/admin/driver-applications", { auth: true });
}

export function setDriverApplicationStatus(
  id: string,
  status: DriverApplication["status"],
) {
  return apiFetch<DriverApplication>(`/admin/driver-applications/${id}/status`, {
    method: "PATCH",
    body: { status },
    auth: true,
  });
}

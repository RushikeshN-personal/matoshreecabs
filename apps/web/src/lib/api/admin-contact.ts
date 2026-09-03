import { apiFetch } from "@/lib/api/client";

export interface ContactEnquiry {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  subject: string;
  message: string;
  status: "NEW" | "READ" | "RESOLVED";
  createdAt: string;
}

export function fetchEnquiries(): Promise<ContactEnquiry[]> {
  return apiFetch<ContactEnquiry[]>("/admin/contact", { auth: true });
}

export function markEnquiryRead(id: string) {
  return apiFetch(`/admin/contact/${id}/read`, { method: "PATCH", auth: true });
}

export function markEnquiryResolved(id: string) {
  return apiFetch(`/admin/contact/${id}/resolve`, { method: "PATCH", auth: true });
}

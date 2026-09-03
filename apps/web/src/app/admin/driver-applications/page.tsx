import type { Metadata } from "next";
import { AdminDriverApplicationsPanel } from "@/components/admin/admin-driver-applications-panel";

export const metadata: Metadata = { title: "Driver Applications — Admin — Matoshree Cabs" };

export default function AdminDriverApplicationsPage() {
  return <AdminDriverApplicationsPanel />;
}

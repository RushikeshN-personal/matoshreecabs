import type { Metadata } from "next";
import { AdminDriversPanel } from "@/components/admin/admin-drivers-panel";

export const metadata: Metadata = { title: "Drivers — Admin — Matoshree Cabs" };

export default function AdminDriversPage() {
  return <AdminDriversPanel />;
}

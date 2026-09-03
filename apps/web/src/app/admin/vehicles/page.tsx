import type { Metadata } from "next";
import { AdminVehiclesPanel } from "@/components/admin/admin-vehicles-panel";

export const metadata: Metadata = { title: "Vehicles — Admin — Matoshree Cabs" };

export default function AdminVehiclesPage() {
  return <AdminVehiclesPanel />;
}

import type { Metadata } from "next";
import { AdminRouteFaresPanel } from "@/components/admin/admin-route-fares-panel";

export const metadata: Metadata = { title: "Route Fares — Admin — Matoshree Cabs" };

export default function AdminRouteFaresPage() {
  return <AdminRouteFaresPanel />;
}

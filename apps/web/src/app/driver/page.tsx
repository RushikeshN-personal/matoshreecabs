import type { Metadata } from "next";
import { DriverDashboardPanel } from "@/components/driver/driver-dashboard-panel";

export const metadata: Metadata = { title: "Driver Dashboard — Matoshree Cabs" };

export default function DriverDashboardPage() {
  return <DriverDashboardPanel />;
}

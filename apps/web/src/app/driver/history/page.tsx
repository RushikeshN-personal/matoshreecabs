import type { Metadata } from "next";
import { DriverHistoryPanel } from "@/components/driver/driver-history-panel";

export const metadata: Metadata = { title: "Trip History — Driver — Matoshree Cabs" };

export default function DriverHistoryPage() {
  return <DriverHistoryPanel />;
}

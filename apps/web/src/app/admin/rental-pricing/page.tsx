import type { Metadata } from "next";
import { AdminRentalPricingPanel } from "@/components/admin/admin-rental-pricing-panel";

export const metadata: Metadata = { title: "Rental Pricing — Admin — Matoshree Cabs" };

export default function AdminRentalPricingPage() {
  return <AdminRentalPricingPanel />;
}

import type { Metadata } from "next";
import { AdminContactPanel } from "@/components/admin/admin-contact-panel";

export const metadata: Metadata = { title: "Enquiries — Admin — Matoshree Cabs" };

export default function AdminContactPage() {
  return <AdminContactPanel />;
}

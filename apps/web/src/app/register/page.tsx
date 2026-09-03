import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Register — Matoshree Cabs" };

export default function RegisterPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-b from-orange-50 to-white px-4 py-12">
      <RegisterForm />
    </div>
  );
}

import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Login — Matoshree Cabs" };

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-b from-orange-50 to-white px-4 py-12">
      <LoginForm />
    </div>
  );
}
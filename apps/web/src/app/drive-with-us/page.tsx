import type { Metadata } from "next";
import { DriverApplicationForm } from "@/components/auth/driver-application-form";

export const metadata: Metadata = {
  title: "Drive With Us — Matoshree Cabs",
  description: "Apply to become a driver with Matoshree Cabs.",
};

export default function DriveWithUsPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-orange-50 to-white">
        <div className="mx-auto max-w-2xl px-4 py-14 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Drive With Us</h1>
          <p className="mt-3 text-gray-600">
            Tell us a bit about yourself — we'll call you to verify your documents and get you
            onboarded.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-2xl px-4 py-10">
        <DriverApplicationForm />
      </section>
    </div>
  );
}

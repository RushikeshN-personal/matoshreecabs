import type { Metadata } from "next";
import Link from "next/link";
import {
  WHY_HEADING,
  WHY_INTRO,
  WHY_FEATURES,
} from "@/lib/constants/why.constants";
import { FeatureCard } from "@/components/why/feature-card";
import { CompareTable } from "@/components/why/compare-table";

export const metadata: Metadata = { title: "Why Matoshree Cabs — Matoshree Cabs" };

export default function WhyPage() {
  return (
    <div className="bg-white">
      {/* header */}
      <section className="bg-gradient-to-b from-orange-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {WHY_HEADING}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">{WHY_INTRO}</p>
        </div>
      </section>

      {/* feature grid */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </section>

      {/* comparison */}
      <section className="mx-auto max-w-4xl px-4 pb-8">
        <h2 className="mb-6 border-l-4 border-orange-500 pl-3 text-2xl font-bold text-gray-900">
          How we compare
        </h2>
        <CompareTable />
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-6">
        <div className="rounded-2xl bg-orange-600 px-6 py-10 text-center text-white">
          <h2 className="text-2xl font-bold">Ready to ride with Matoshree Cabs?</h2>
          <p className="mt-2 text-white/90">Book a cab from Pune in a couple of minutes.</p>
          <Link
            href="/book"
            className="mt-5 inline-block rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-orange-700 hover:bg-orange-50"
          >
            Book a Ride
          </Link>
        </div>
      </section>
    </div>
  );
}
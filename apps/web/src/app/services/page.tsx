import type { Metadata } from "next";
import Link from "next/link";
import {
  RENTAL_SERVICES,
  RENTAL_SERVICES_HEADING,
  RENTAL_SERVICES_INTRO,
} from "@/lib/constants/rental-services.constants";
import { RentalIconBadge } from "@/components/services/rental-icon";

export const metadata: Metadata = {
  title: "Services — Matoshree Cabs",
  description: "Economy, luxury, event, corporate and local city car rentals from Pune.",
};

export default function ServicesPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-orange-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {RENTAL_SERVICES_HEADING}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">{RENTAL_SERVICES_INTRO}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RENTAL_SERVICES.map((s) => (
            <div
              key={s.title}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-lg"
            >
              <RentalIconBadge name={s.icon} />
              <h3 className="mt-5 text-lg font-bold text-gray-900">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{s.description}</p>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <Link
                  href={s.href}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700"
                >
                  View Details <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

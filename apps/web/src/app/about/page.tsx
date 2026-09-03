import type { Metadata } from "next";
import {
  ABOUT_HEADING,
  ABOUT_INTRO,
  ABOUT_STATS,
  ABOUT_VALUES,
} from "@/lib/constants/about.constants";
import { StatCounter } from "@/app/about/stat-counter";

export const metadata: Metadata = {
  title: "About Us — Matoshree Cabs",
  description:
    "Matoshree Cabs is a Pune-based cab service for local, airport, outstation and rental trips.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* header band */}
      <section className="bg-gradient-to-b from-orange-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {ABOUT_HEADING}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            {ABOUT_INTRO}
          </p>
        </div>
      </section>

      {/* animated stats */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {ABOUT_STATS.map((stat) => (
            <StatCounter key={stat.label} stat={stat} />
          ))}
        </div>
      </section>

      {/* value cards with hover interaction */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="mb-8 border-l-4 border-orange-500 pl-3 text-2xl font-bold text-gray-900">
          Why travellers trust us
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {ABOUT_VALUES.map((value) => (
            <div
              key={value.title}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-orange-600">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {value.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
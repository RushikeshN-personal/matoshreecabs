import type { Metadata } from "next";
import { SITE } from "@/lib/constants/site.constants";
import { TERMS_SECTIONS, TERMS_LAST_UPDATED } from "@/lib/constants/terms.constants";

export const metadata: Metadata = {
  title: "Terms & Conditions — Matoshree Cabs",
  description: "Terms and conditions for booking a cab with Matoshree Cabs.",
};

export default function TermsPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-orange-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 text-sm text-gray-500">Last updated: {TERMS_LAST_UPDATED}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="space-y-8">
          {TERMS_SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
              <div className="mt-2 space-y-3">
                {section.body.map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-gray-600">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-orange-50 p-6 text-sm text-gray-700">
          <p className="font-semibold text-orange-800">Questions about these terms?</p>
          <p className="mt-1">
            Reach us at{" "}
            <a href={`mailto:${SITE.email}`} className="font-semibold text-orange-700 underline">
              {SITE.email}
            </a>{" "}
            or{" "}
            <a href={`tel:${SITE.phone}`} className="font-semibold text-orange-700 underline">
              {SITE.phoneDisplay}
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

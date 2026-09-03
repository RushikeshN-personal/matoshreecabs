import type { Metadata } from "next";
import {
  CONTACT_HEADING,
  CONTACT_INTRO,
  CONTACT_METHODS,
} from "@/lib/constants/contact.constants";
import { ContactIcon } from "@/components/contact/contact-icon";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = { title: "Contact Us — Matoshree Cabs" };

export default function ContactPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-orange-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {CONTACT_HEADING}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            {CONTACT_INTRO}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-8 md:grid-cols-5">
          {/* contact methods */}
          <div className="space-y-4 md:col-span-2">
            {CONTACT_METHODS.map((m) => {
              const inner = (
                <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-orange-200 hover:shadow-md">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50">
                    <ContactIcon name={m.icon} />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-gray-500">{m.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{m.value}</p>
                  </div>
                </div>
              );
              return m.href ? (
                <a key={m.label} href={m.href} target={m.icon === "whatsapp" ? "_blank" : undefined} rel="noreferrer">
                  {inner}
                </a>
              ) : (
                <div key={m.label}>{inner}</div>
              );
            })}
          </div>

          {/* form */}
          <div className="md:col-span-3">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
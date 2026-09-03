"use client";

import { useState } from "react";
import { contactSchema, type ContactInput } from "@matoshreecabs/shared";
import { submitContact } from "@/lib/api/contact";
import { CONTACT_SUBJECTS } from "@/lib/constants/contact.constants";

type Errors = Partial<Record<keyof ContactInput, string>>;

const EMPTY: ContactInput = {
  name: "", mobile: "", email: "", subject: CONTACT_SUBJECTS[0], message: "",
};

export function ContactForm() {
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function set<K extends keyof ContactInput>(key: K, val: ContactInput[K]) {
    setValues((v) => ({ ...v, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        next[issue.path[0] as keyof ContactInput] = issue.message;
      }
      setErrors(next);
      return;
    }
    setSubmitting(true);
    // No backend endpoint yet — simulate send. Wire to POST /contact later.
    try {
      await submitContact(parsed.data);
      setSent(true);
    } catch (err) {
      setErrors({ message: (err as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-orange-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-bold text-gray-900">Message sent!</h3>
        <p className="mt-1 text-sm text-gray-600">
          Thanks {values.name.split(" ")[0]} — we&apos;ll get back to you shortly.
        </p>
        <button
          onClick={() => { setValues(EMPTY); setSent(false); }}
          className="mt-5 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
        >
          Send another
        </button>
      </div>
    );
  }

  const field =
    "w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500";
  const err = "mt-1 text-xs text-red-600";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Name *</label>
          <input className={`${field} ${errors.name ? "border-red-400" : "border-gray-200"}`}
            value={values.name} onChange={(e) => set("name", e.target.value)} />
          {errors.name && <p className={err}>{errors.name}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Mobile *</label>
          <input className={`${field} ${errors.mobile ? "border-red-400" : "border-gray-200"}`}
            value={values.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="9876543210" />
          {errors.mobile && <p className={err}>{errors.mobile}</p>}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Email (optional)</label>
          <input className={`${field} ${errors.email ? "border-red-400" : "border-gray-200"}`}
            value={values.email} onChange={(e) => set("email", e.target.value)} />
          {errors.email && <p className={err}>{errors.email}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Subject</label>
          <select className={`${field} border-gray-200`}
            value={values.subject} onChange={(e) => set("subject", e.target.value)}>
            {CONTACT_SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-medium text-gray-500">Message *</label>
        <textarea rows={4}
          className={`${field} ${errors.message ? "border-red-400" : "border-gray-200"}`}
          value={values.message} onChange={(e) => set("message", e.target.value)}
          placeholder="How can we help?" />
        {errors.message && <p className={err}>{errors.message}</p>}
      </div>

      <button type="submit" disabled={submitting}
        className="mt-5 w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60">
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
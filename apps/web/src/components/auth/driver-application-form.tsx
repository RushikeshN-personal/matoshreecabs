"use client";

import { useState } from "react";
import { driverApplicationSchema, type DriverApplicationInput } from "@matoshreecabs/shared";
import { submitDriverApplication } from "@/lib/api/driver-applications";

type Errors = Partial<Record<keyof DriverApplicationInput, string>>;

const EMPTY: DriverApplicationInput = {
  name: "",
  mobile: "",
  email: "",
  city: "",
  licenceNo: "",
  experienceYrs: 0,
  ownsVehicle: false,
  vehicleType: "",
  vehicleNumber: "",
  notes: "",
};

export function DriverApplicationForm() {
  const [values, setValues] = useState<DriverApplicationInput>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function set<K extends keyof DriverApplicationInput>(key: K, val: DriverApplicationInput[K]) {
    setValues((v) => ({ ...v, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    const parsed = driverApplicationSchema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        next[issue.path[0] as keyof DriverApplicationInput] = issue.message;
      }
      setErrors(next);
      return;
    }
    setSubmitting(true);
    try {
      await submitDriverApplication(parsed.data);
      setSent(true);
    } catch (err) {
      setSubmitError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-orange-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-bold text-gray-900">Application received!</h3>
        <p className="mt-1 text-sm text-gray-600">
          Thanks {values.name.split(" ")[0]} — our team will call you to verify your documents
          and take things from there.
        </p>
        <button
          onClick={() => { setValues(EMPTY); setSent(false); }}
          className="mt-5 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
        >
          Submit another application
        </button>
      </div>
    );
  }

  const field =
    "w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500";
  const err = "mt-1 text-xs text-red-600";
  const label = "mb-1 block text-xs font-medium text-gray-500";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {submitError && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Full name *</label>
          <input className={`${field} ${errors.name ? "border-red-400" : "border-gray-200"}`}
            value={values.name} onChange={(e) => set("name", e.target.value)} />
          {errors.name && <p className={err}>{errors.name}</p>}
        </div>
        <div>
          <label className={label}>Mobile *</label>
          <input className={`${field} ${errors.mobile ? "border-red-400" : "border-gray-200"}`}
            value={values.mobile}
            onChange={(e) => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="9876543210" inputMode="numeric" />
          {errors.mobile && <p className={err}>{errors.mobile}</p>}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Email (optional)</label>
          <input className={`${field} ${errors.email ? "border-red-400" : "border-gray-200"}`}
            value={values.email} onChange={(e) => set("email", e.target.value)} />
          {errors.email && <p className={err}>{errors.email}</p>}
        </div>
        <div>
          <label className={label}>City / area you drive in *</label>
          <input className={`${field} ${errors.city ? "border-red-400" : "border-gray-200"}`}
            value={values.city} onChange={(e) => set("city", e.target.value)}
            placeholder="e.g. Pune" />
          {errors.city && <p className={err}>{errors.city}</p>}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label className={label}>Driving licence number *</label>
          <input className={`${field} ${errors.licenceNo ? "border-red-400" : "border-gray-200"}`}
            value={values.licenceNo} onChange={(e) => set("licenceNo", e.target.value.toUpperCase())} />
          {errors.licenceNo && <p className={err}>{errors.licenceNo}</p>}
        </div>
        <div>
          <label className={label}>Licence valid till (optional)</label>
          <input type="date" className={`${field} border-gray-200`}
            value={values.licenceExpiry ? String(values.licenceExpiry).slice(0, 10) : ""}
            onChange={(e) => set("licenceExpiry", e.target.value ? new Date(e.target.value) : undefined)} />
        </div>
        <div>
          <label className={label}>Years of driving experience *</label>
          <input type="number" min={0} className={`${field} border-gray-200`}
            value={values.experienceYrs}
            onChange={(e) => set("experienceYrs", Math.max(0, Number(e.target.value) || 0))} />
        </div>
      </div>

      <div className="mt-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={values.ownsVehicle}
            onChange={(e) => set("ownsVehicle", e.target.checked)} />
          I own the vehicle I'd drive
        </label>
      </div>

      {values.ownsVehicle && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Vehicle type (optional)</label>
            <input className={`${field} border-gray-200`}
              value={values.vehicleType} onChange={(e) => set("vehicleType", e.target.value)}
              placeholder="e.g. Sedan, Ertiga" />
          </div>
          <div>
            <label className={label}>Vehicle registration number (optional)</label>
            <input className={`${field} border-gray-200`}
              value={values.vehicleNumber} onChange={(e) => set("vehicleNumber", e.target.value.toUpperCase())}
              placeholder="MH12AB1234" />
          </div>
        </div>
      )}

      <div className="mt-4">
        <label className={label}>Preferred trips (optional)</label>
        <select className={`${field} border-gray-200`}
          value={values.preferredTrips ?? ""}
          onChange={(e) => set("preferredTrips", (e.target.value || undefined) as DriverApplicationInput["preferredTrips"])}>
          <option value="">No preference</option>
          <option value="LOCAL">Local</option>
          <option value="OUTSTATION">Outstation</option>
          <option value="BOTH">Both</option>
        </select>
      </div>

      <div className="mt-4">
        <label className={label}>Anything else we should know? (optional)</label>
        <textarea rows={3} className={`${field} border-gray-200`}
          value={values.notes} onChange={(e) => set("notes", e.target.value)}
          placeholder="Languages you speak, availability, etc." />
      </div>

      <p className="mt-4 text-xs text-gray-500">
        We don't collect ID documents (Aadhaar/PAN/RC) on this form — our team verifies those
        with you directly once we call to follow up.
      </p>

      <button type="submit" disabled={submitting}
        className="mt-5 w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60">
        {submitting ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}

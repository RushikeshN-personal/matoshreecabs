"use client";

import { useEffect, useState } from "react";
import {
  createDriver,
  deactivateDriver,
  fetchDrivers,
  type AdminDriver,
} from "@/lib/api/admin-drivers";

const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500";

export function AdminDriversPanel() {
  const [drivers, setDrivers] = useState<AdminDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    location: "",
    licenceNo: "",
    experienceYrs: 0,
  });

  function load() {
    setLoading(true);
    fetchDrivers()
      .then(setDrivers)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createDriver(form);
      setForm({ name: "", email: "", mobile: "", location: "", licenceNo: "", experienceYrs: 0 });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create driver");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeactivate(userId: string) {
    try {
      await deactivateDriver(userId);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not deactivate driver");
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Drivers</h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="rounded-lg bg-orange-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-700"
        >
          {showForm ? "Cancel" : "Add driver"}
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 grid gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:grid-cols-2"
        >
          <input
            className={inputCls}
            placeholder="Full name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className={inputCls}
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="10-digit mobile"
            required
            value={form.mobile}
            onChange={(e) =>
              setForm({ ...form, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })
            }
          />
          <input
            className={inputCls}
            placeholder="Location (e.g. Pune)"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="Licence number"
            required
            value={form.licenceNo}
            onChange={(e) => setForm({ ...form, licenceNo: e.target.value })}
          />
          <input
            className={inputCls}
            type="number"
            min={0}
            placeholder="Years of experience"
            value={form.experienceYrs}
            onChange={(e) => setForm({ ...form, experienceYrs: Number(e.target.value) || 0 })}
          />
          <p className="text-xs text-gray-400 sm:col-span-2">
            No password needed — a temporary one is generated and emailed to the driver.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="sm:col-span-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60"
          >
            {submitting ? "Creating…" : "Create driver"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading drivers…</p>
      ) : drivers.length === 0 ? (
        <p className="text-sm text-gray-500">No drivers yet.</p>
      ) : (
        <div className="space-y-2">
          {drivers.map((d) => (
            <div
              key={d.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
            >
              <div>
                <p className="font-semibold text-gray-900">{d.user.name}</p>
                <p className="text-sm text-gray-500">
                  {d.user.mobile} · {d.user.email} · Licence {d.licenceNo} · {d.experienceYrs} yrs
                  {d.location ? ` · ${d.location}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={
                    "rounded-full px-2 py-0.5 text-xs font-semibold " +
                    (d.availability === "AVAILABLE"
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-600")
                  }
                >
                  {d.availability === "AVAILABLE" ? "Available" : "Off duty"}
                </span>
                <span
                  className={
                    "rounded-full px-2 py-0.5 text-xs font-semibold " +
                    (d.status === "ACTIVE" ? "bg-orange-50 text-orange-700" : "bg-red-50 text-red-700")
                  }
                >
                  {d.status === "ACTIVE" ? "Active" : "Disabled"}
                </span>
                {d.status === "ACTIVE" && (
                  <button
                    onClick={() => handleDeactivate(d.userId)}
                    className="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                  >
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

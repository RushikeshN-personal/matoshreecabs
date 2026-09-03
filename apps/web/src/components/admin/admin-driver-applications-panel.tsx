"use client";

import { useEffect, useState } from "react";
import {
  fetchDriverApplications,
  setDriverApplicationStatus,
  type DriverApplication,
} from "@/lib/api/driver-applications";

function statusTone(status: string) {
  if (status === "APPROVED") return "bg-green-50 text-green-700";
  if (status === "REJECTED") return "bg-red-50 text-red-700";
  if (status === "REVIEWING") return "bg-orange-50 text-orange-700";
  return "bg-gray-100 text-gray-700";
}

export function AdminDriverApplicationsPanel() {
  const [applications, setApplications] = useState<DriverApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetchDriverApplications()
      .then(setApplications)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleStatus(id: string, status: DriverApplication["status"]) {
    try {
      await setDriverApplicationStatus(id, status);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status");
    }
  }

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-gray-900">Driver Applications</h2>
      <p className="mb-4 text-sm text-gray-500">
        No ID documents are collected here — verify Aadhaar/PAN/RC/insurance on the follow-up
        call. Clicking Approve creates the driver's account right away and emails them a
        temporary password.
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading applications…</p>
      ) : applications.length === 0 ? (
        <p className="text-sm text-gray-500">No applications yet.</p>
      ) : (
        <div className="space-y-2">
          {applications.map((a) => (
            <div key={a.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900">{a.name}</p>
                  <p className="text-sm text-gray-500">
                    {a.mobile}
                    {a.email ? ` · ${a.email}` : ""} · {a.city} ·{" "}
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(a.status)}`}>
                  {a.status}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
                <span>Licence: {a.licenceNo}</span>
                {a.licenceExpiry && (
                  <span>Valid till: {new Date(a.licenceExpiry).toLocaleDateString()}</span>
                )}
                <span>{a.experienceYrs} yrs experience</span>
                <span>{a.ownsVehicle ? "Owns vehicle" : "No vehicle"}</span>
                {a.vehicleType && <span>{a.vehicleType}</span>}
                {a.vehicleNumber && <span>{a.vehicleNumber}</span>}
                {a.preferredTrips && <span>Prefers: {a.preferredTrips}</span>}
              </div>

              {a.notes && <p className="mt-2 text-sm text-gray-600">{a.notes}</p>}

              <div className="mt-3 flex flex-wrap gap-2">
                {a.status !== "REVIEWING" && a.status !== "APPROVED" && (
                  <button
                    onClick={() => handleStatus(a.id, "REVIEWING")}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Mark reviewing
                  </button>
                )}
                {a.status !== "APPROVED" && (
                  <button
                    onClick={() => handleStatus(a.id, "APPROVED")}
                    className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}
                {a.status !== "REJECTED" && (
                  <button
                    onClick={() => handleStatus(a.id, "REJECTED")}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                  >
                    Reject
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

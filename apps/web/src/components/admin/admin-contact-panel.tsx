"use client";

import { useEffect, useState } from "react";
import {
  fetchEnquiries,
  markEnquiryRead,
  markEnquiryResolved,
  type ContactEnquiry,
} from "@/lib/api/admin-contact";

function statusTone(status: string) {
  if (status === "RESOLVED") return "bg-green-50 text-green-700";
  if (status === "READ") return "bg-orange-50 text-orange-700";
  return "bg-red-50 text-red-700";
}

export function AdminContactPanel() {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetchEnquiries()
      .then(setEnquiries)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleRead(id: string) {
    await markEnquiryRead(id);
    load();
  }

  async function handleResolve(id: string) {
    await markEnquiryResolved(id);
    load();
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">Contact Enquiries</h2>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading enquiries…</p>
      ) : enquiries.length === 0 ? (
        <p className="text-sm text-gray-500">No enquiries yet.</p>
      ) : (
        <div className="space-y-2">
          {enquiries.map((e) => (
            <div key={e.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900">
                    {e.subject} · <span className="font-normal text-gray-500">{e.name}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {e.mobile}
                    {e.email ? ` · ${e.email}` : ""} ·{" "}
                    {new Date(e.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(e.status)}`}>
                  {e.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700">{e.message}</p>
              <div className="mt-3 flex gap-2">
                {e.status === "NEW" && (
                  <button
                    onClick={() => handleRead(e.id)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Mark read
                  </button>
                )}
                {e.status !== "RESOLVED" && (
                  <button
                    onClick={() => handleResolve(e.id)}
                    className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700"
                  >
                    Mark resolved
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

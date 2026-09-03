"use client";

import { useState } from "react";

export function FooterSubscribe() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setDone(true); // hook up to a backend endpoint later
    setEmail("");
  }

  return (
    <div>
      <h4 className="text-sm font-bold text-white">Stay updated</h4>
      <p className="mt-1 text-xs text-gray-400">Offers and new routes from Pune.</p>

      {done ? (
        <p className="mt-3 rounded-lg bg-orange-600/20 px-3 py-2 text-xs text-orange-300">
          Thanks — you&apos;re subscribed!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-orange-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-700"
          >
            Join
          </button>
        </form>
      )}
    </div>
  );
}
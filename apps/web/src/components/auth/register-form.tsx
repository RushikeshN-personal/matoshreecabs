"use client";

import { useState } from "react";
import Link from "next/link";
import { register, loginWithPassword } from "@/lib/api/auth";
import { saveAuth } from "@/lib/auth/auth-storage";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, mobile, password });
      // Registered — sign them straight in so they land on the site logged in.
      const res = await loginWithPassword(email, password);
      saveAuth(res.accessToken, res.user);
      window.location.href = "/";
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const input =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500";
  const btn =
    "w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-700 disabled:opacity-60";

  return (
    <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
      <h1 className="text-2xl font-extrabold text-gray-900">Create your account</h1>
      <p className="mt-1 text-sm text-gray-500">
        No advance payment needed to book — an account just makes it easy to track your rides.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          className={input}
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className={input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={input}
          placeholder="10-digit mobile"
          inputMode="numeric"
          value={mobile}
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
          required
        />
        <input
          className={input}
          type="password"
          placeholder="Password (min. 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className={btn} disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-orange-700 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

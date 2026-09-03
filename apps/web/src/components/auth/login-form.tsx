"use client";

import { useState } from "react";
import Link from "next/link";
import { loginWithPassword } from "@/lib/api/auth";
import { saveAuth } from "@/lib/auth/auth-storage";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
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
      <h1 className="text-2xl font-extrabold text-gray-900">Login</h1>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={handlePasswordLogin} className="mt-4 space-y-3">
        <input className={input} type="email" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className={input} type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className={btn} disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-5 space-y-1.5 border-t border-gray-100 pt-4 text-center text-sm">
        <p className="text-gray-500">
          New here?{" "}
          <Link href="/register" className="font-semibold text-orange-700 hover:underline">
            Create an account
          </Link>
        </p>
        <p className="text-gray-500">
          Want to drive for us?{" "}
          <Link href="/drive-with-us" className="font-semibold text-orange-700 hover:underline">
            Apply as a driver
          </Link>
        </p>
      </div>
    </div>
  );
}

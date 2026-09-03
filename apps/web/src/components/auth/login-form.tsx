"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginWithPassword, requestOtp, verifyOtp } from "@/lib/api/auth";
import { saveAuth } from "@/lib/auth/auth-storage";

type Mode = "password" | "otp";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
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

  async function handleSendOtp() {
    setError(null);
    setLoading(true);
    try {
      const res = await requestOtp(email);
      setOtpSent(true);
      setDevCode(res.devCode ?? null); // dev-only convenience
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await verifyOtp(email, otp);
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

      {/* mode toggle */}
      <div className="mt-4 flex gap-2">
        {(["password", "otp"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setError(null); }}
            className={
              "flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold " +
              (mode === m
                ? "bg-orange-600 text-white"
                : "bg-orange-50 text-orange-700 hover:bg-orange-100")
            }
          >
            {m === "password" ? "Password" : "Email OTP"}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {mode === "password" ? (
        <form onSubmit={handlePasswordLogin} className="mt-4 space-y-3">
          <input className={input} type="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className={input} type="password" placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className={btn} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="mt-4 space-y-3">
          <input className={input} type="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} required />

          {!otpSent ? (
            <button type="button" className={btn} disabled={loading} onClick={handleSendOtp}>
              {loading ? "Sending…" : "Send OTP"}
            </button>
          ) : (
            <>
              {devCode && (
                <p className="rounded-lg bg-orange-50 px-3 py-2 text-xs text-orange-700">
                  Dev OTP: <b>{devCode}</b>
                </p>
              )}
              <input className={input} inputMode="numeric" placeholder="6-digit OTP"
                value={otp} onChange={(e) => setOtp(e.target.value)} required />
              <button className={btn} disabled={loading}>
                {loading ? "Verifying…" : "Verify & sign in"}
              </button>
            </>
          )}
        </form>
      )}

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
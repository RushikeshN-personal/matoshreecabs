"use client";

import { useEffect, useState } from "react";
import { getUser, clearAuth, type AuthUser } from "@/lib/auth/auth-storage";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setReady(true);

    // keep in sync if another tab logs in/out
    const onStorage = () => setUser(getUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function logout() {
    clearAuth();
    setUser(null);
    window.location.href = "/"; // hard refresh so all components reset
  }

  return { user, ready, logout };
}
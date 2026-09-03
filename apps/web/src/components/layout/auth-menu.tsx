"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/use-auth";
import { LOGIN_HREF } from "@/lib/constants/nav.constants";

export function AuthMenu() {
  const { user, ready, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // avoid a flash before we've read localStorage
  if (!ready) return <span className="h-9 w-9" />;

  if (!user) {
    return (
      <Link href={LOGIN_HREF} className="text-sm font-medium text-gray-700 hover:text-orange-600">
        Login
      </Link>
    );
  }

  const initial = user.name.trim().charAt(0).toUpperCase();

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Account menu for ${user.name}`}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white transition-colors hover:bg-orange-700"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
          <div className="my-1 border-t border-gray-100" />

          {user.role === "CUSTOMER" && (
            <Link
              href="/my-bookings"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50"
            >
              My Bookings
            </Link>
          )}
          {(user.role === "ADMIN" || user.role === "DEVELOPER") && (
            <Link
              href="/admin/bookings"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50"
            >
              Admin Dashboard
            </Link>
          )}
          {user.role === "DRIVER" && (
            <Link
              href="/driver"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50"
            >
              Driver Dashboard
            </Link>
          )}

          <div className="my-1 border-t border-gray-100" />
          <button
            type="button"
            onClick={logout}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

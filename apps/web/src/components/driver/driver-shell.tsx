"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth/use-auth";

const NAV = [
  { href: "/driver", label: "Dashboard" },
  { href: "/driver/history", label: "Trip History" },
];

export function DriverShell({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready) return;
    if (!user || user.role !== "DRIVER") {
      router.replace("/login");
    }
  }, [ready, user, router]);

  if (!ready) return null;
  if (!user || user.role !== "DRIVER") return null;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-6xl gap-6 px-4 py-8">
      <aside className="w-48 shrink-0">
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Driver
        </p>
        <nav className="space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
                (pathname === item.href
                  ? "bg-orange-600 text-white"
                  : "text-gray-700 hover:bg-orange-50")
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

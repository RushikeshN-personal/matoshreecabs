"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth/use-auth";

const NAV = [
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/drivers", label: "Drivers" },
  { href: "/admin/driver-applications", label: "Driver Applications" },
  { href: "/admin/vehicles", label: "Vehicles & Rates" },
  { href: "/admin/route-fares", label: "Route Fares" },
  { href: "/admin/rental-pricing", label: "Rental Pricing" },
  { href: "/admin/contact", label: "Enquiries" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready) return;
    if (!user || (user.role !== "ADMIN" && user.role !== "DEVELOPER")) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  if (!ready) return null;
  if (!user || (user.role !== "ADMIN" && user.role !== "DEVELOPER")) return null;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-6xl gap-6 px-4 py-8">
      <aside className="w-52 shrink-0">
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Admin
        </p>
        <nav className="space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
                (pathname?.startsWith(item.href)
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

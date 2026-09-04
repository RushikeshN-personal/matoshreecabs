import type { MetadataRoute } from "next";
import { ROUTE_SERVICES } from "@/lib/constants/route-services.constants";
import { fetchCabs } from "@/lib/api/cabs";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.matoshreecabs.com";

// Public, indexable pages. Admin/driver/auth pages are intentionally left
// out (also blocked in robots.ts).
const STATIC_PATHS = [
  "",
  "/about",
  "/why",
  "/cabs",
  "/services",
  "/price-catalog",
  "/contact",
  "/drive-with-us",
  "/track-booking",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const routeEntries: MetadataRoute.Sitemap = ROUTE_SERVICES.map((r) => ({
    url: `${SITE_URL}/services/${r.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Per-cab pages — best effort; if the API is unreachable at build time
  // we still ship the rest of the sitemap.
  let cabEntries: MetadataRoute.Sitemap = [];
  try {
    const cabs = await fetchCabs();
    cabEntries = cabs.map((c) => ({
      url: `${SITE_URL}/cabs/${c.id}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    cabEntries = [];
  }

  return [...staticEntries, ...routeEntries, ...cabEntries];
}

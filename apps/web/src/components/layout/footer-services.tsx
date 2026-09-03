import Link from "next/link";
import { ROUTE_SERVICES, type RouteService } from "@/lib/constants/route-services.constants";

// Group every route by its pickup city — "FROM PUNE", "FROM NASHIK", etc. —
// in the order each city first appears, matching how a long-tail route
// sitemap is usually laid out.
const GROUPS: Array<{ city: string; routes: RouteService[] }> = (() => {
  const order: string[] = [];
  const byCity = new Map<string, RouteService[]>();
  for (const r of ROUTE_SERVICES) {
    if (!byCity.has(r.fromCity)) {
      byCity.set(r.fromCity, []);
      order.push(r.fromCity);
    }
    byCity.get(r.fromCity)!.push(r);
  }
  return order.map((city) => ({ city, routes: byCity.get(city)! }));
})();

function RouteGroup({ city, routes }: { city: string; routes: RouteService[] }) {
  return (
    <div className="break-inside-avoid pb-8">
      <h3 className="text-xs font-bold uppercase tracking-wide text-orange-400">
        From {city}
      </h3>
      <ul className="mt-3 space-y-2">
        {routes.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/services/${r.slug}`}
              className="text-sm text-gray-300 transition-colors hover:text-orange-400"
            >
              {r.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FooterServices() {
  return (
    <div className="border-b border-gray-800 bg-gradient-to-b from-black/40 to-black/10">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold text-white">All Cab Services</h2>
          <p className="mt-2 text-sm text-gray-400">
            Every route we run across Maharashtra, by pickup point — tap any of them for trip
            details and a fare estimate.
          </p>
        </div>

        <div className="mt-8 columns-1 gap-x-10 sm:columns-2 lg:columns-4">
          {GROUPS.map((g) => (
            <RouteGroup key={g.city} city={g.city} routes={g.routes} />
          ))}
        </div>
      </div>
    </div>
  );
}

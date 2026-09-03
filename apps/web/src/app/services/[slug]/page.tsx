import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ROUTE_SERVICES, type RouteService } from "@/lib/constants/route-services.constants";
import { resolveLocationInfo } from "@/lib/constants/location-info.constants";
import {
  buildRouteIntro,
  buildRouteHighlights,
  buildRouteFaq,
  estimateTripInfo,
} from "@/lib/route-content";
import { BOOK_RIDE_HREF } from "@/lib/constants/nav.constants";
import { SITE } from "@/lib/constants/site.constants";
import { RouteVehicles } from "@/components/services/route-vehicles";

export function generateStaticParams() {
  return ROUTE_SERVICES.map((r) => ({ slug: r.slug }));
}

function findRoute(slug: string) {
  return ROUTE_SERVICES.find((r) => r.slug === slug);
}

// A handful of other routes sharing an endpoint with this one, for cross-linking.
function relatedRoutes(route: RouteService): RouteService[] {
  return ROUTE_SERVICES.filter(
    (r) =>
      r.slug !== route.slug &&
      (r.fromCity === route.fromCity ||
        r.toCity === route.toCity ||
        r.fromCity === route.toCity ||
        r.toCity === route.fromCity),
  ).slice(0, 6);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = findRoute(slug);
  if (!route) return { title: "Service — Matoshree Cabs" };
  return {
    title: `${route.label} — Matoshree Cabs`,
    description: buildRouteIntro(route),
  };
}

export default async function RouteServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const route = findRoute(slug);
  if (!route) notFound();

  const from = resolveLocationInfo(route.fromCity);
  const to = resolveLocationInfo(route.toCity);
  const intro = buildRouteIntro(route);
  const highlights = buildRouteHighlights(route);
  const faq = buildRouteFaq(route);
  const trip = estimateTripInfo(route);
  const related = relatedRoutes(route);
  const whatsappMessage = `Hi, I'd like to book a cab for ${route.label} (${route.fromCity} to ${route.toCity}).`;
  const whatsappHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-orange-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{route.label}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">{intro}</p>

          {/* Trip stat bar */}
          <div className="mx-auto mt-6 flex max-w-md flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-gray-600">
            <span>
              <span className="font-bold text-gray-900">{route.fromCity}</span> → {route.toCity}
            </span>
            {trip && (
              <>
                <span>
                  Approx. <span className="font-bold text-gray-900">{trip.km} km</span>
                </span>
                <span>
                  Approx. <span className="font-bold text-gray-900">{trip.duration}</span>
                </span>
              </>
            )}
          </div>
  {/* no need to uncomment the below block during the modification we will use it in future. */}
          {/* <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700"
            >
              Book this route on WhatsApp
            </a>
            <Link
              href={BOOK_RIDE_HREF}
              className="text-sm font-semibold text-orange-700 underline hover:text-orange-800"
            >
              or book online instead
            </Link>
          </div> */}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        {/* Pickup / Drop location cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
            <div
              className="h-56 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${from.image})` }}
            />
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                Pickup
              </p>
              <h2 className="mt-1 text-xl font-bold text-gray-900">{route.fromCity}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{from.blurb}</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
            <div
              className="h-56 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${to.image})` }}
            />
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                Drop
              </p>
              <h2 className="mt-1 text-xl font-bold text-gray-900">{route.toCity}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{to.blurb}</p>
            </div>
          </div>
        </div>

        {/* Why book */}
        <div className="mt-10 rounded-2xl bg-orange-50 p-6">
          <h3 className="text-lg font-bold text-orange-800">Why book with Matoshree Cabs</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        {/* Available cabs */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900">
            Cabs available for {route.fromCity} to {route.toCity}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Pick a cab now, or choose one when you message us on WhatsApp.
          </p>
          <div className="mt-5">
            <RouteVehicles />
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900">Frequently asked questions</h3>
          <div className="mt-4 divide-y divide-gray-100 rounded-2xl border border-gray-100">
            {faq.map((item) => (
              <details key={item.question} className="group p-4 open:bg-gray-50">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-gray-900">
                  {item.question}
                  <span className="ml-4 shrink-0 text-orange-600 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Related routes */}
        {related.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-bold text-gray-900">Other routes you might need</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/services/${r.slug}`}
                  className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <p className="mt-10 text-center text-sm text-gray-500">
          Exact fare depends on your pickup point, cab type, and trip time — start a booking to
          get an itemised estimate before you confirm.
        </p>
        <div className="mt-4 flex justify-center">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700"
          >
            Book this route on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}

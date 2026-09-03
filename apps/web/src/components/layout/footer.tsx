import Link from "next/link";
import { SITE } from "@/lib/constants/site.constants";
import { FOOTER_COLUMNS } from "@/lib/constants/footer.constants";
import { FooterSubscribe } from "./footer-subscribe";
import { FooterServices } from "./footer-services";
import { BackToTop } from "./back-to-top";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20Zm4.4-5.6c-.24-.12-1.4-.7-1.62-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06a6.5 6.5 0 0 1-1.92-1.18 7.2 7.2 0 0 1-1.32-1.66c-.14-.24 0-.36.1-.48.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.4-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-gray-900 text-gray-300">
      <FooterServices />

      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-6">
          {/* brand + contact */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block rounded-lg bg-white p-2" aria-label={SITE.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SITE.logo} alt={SITE.name} className="h-16 w-auto" />
            </Link>
            <p className="mt-3 max-w-xs text-sm text-gray-400">{SITE.tagline}</p>
            <a
              href={`tel:${SITE.phone}`}
              className="mt-4 block text-sm font-semibold text-white hover:text-orange-400"
            >
              {SITE.phoneDisplay}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-1 block text-sm font-semibold text-white hover:text-orange-400"
            >
              {SITE.email}
            </a>

            <div className="mt-4 flex gap-3">
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-300 transition-colors hover:bg-green-600 hover:text-white"
              >
                <WhatsAppIcon />
              </a>
              <a
                href={`mailto:${SITE.email}`}
                aria-label="Email us"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-300 transition-colors hover:bg-orange-600 hover:text-white"
              >
                <MailIcon />
              </a>
            </div>
          </div>

          {/* link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-white">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-sm text-gray-400 transition-colors hover:text-orange-400"
                    >
                      <span className="mr-0 w-0 overflow-hidden text-orange-500 transition-all duration-200 group-hover:mr-1 group-hover:w-3">
                        ›
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* subscribe */}
          <div className="md:col-span-1">
            <FooterSubscribe />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-gray-800 pt-6 text-xs text-gray-500 sm:flex-row">
          <p>© {year} {SITE.name}. All rights reserved.</p>
          <p>Pickup from Pune · Local · Outstation · Airport · Rental</p>
        </div>
      </div>

      <BackToTop />
    </footer>
  );
}
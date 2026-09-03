"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/constants/site.constants";
import { NAV_LINKS, BOOK_RIDE_HREF } from "@/lib/constants/nav.constants";
import { AuthMenu } from "./auth-menu";

function PhoneIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11 11 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11 11 0 0 0 .56 3.5 1 1 0 0 1-.24 1L6.6 10.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20Zm4.4-5.6c-.24-.12-1.4-.7-1.62-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06a6.5 6.5 0 0 1-1.92-1.18 7.2 7.2 0 0 1-1.32-1.66c-.14-.24 0-.36.1-.48.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.4-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="flex items-center" aria-label={SITE.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SITE.logo} alt={SITE.name} className="h-16 w-auto" />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-orange-600"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 md:flex">

           <a href={`tel:${SITE.phone}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-orange-600"
          >
            <PhoneIcon size={24} />
            Book on Call
          </a>
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-green-600"
          >
            <WhatsAppIcon size={24} />
            Book on WhatsApp
          </a>
          <Link
            href={BOOK_RIDE_HREF}
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
          >
            Book Ride
          </Link>
         <AuthMenu />
        </div>

        {/* Mobile: call + WhatsApp shown outside the menu, always visible */}
        <div className="flex items-center gap-3 md:hidden">
          <a
            href={`tel:${SITE.phone}`}
            aria-label="Call us"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-600"
          >
            <PhoneIcon size={26} />
          </a>
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 text-green-600"
          >
            <WhatsAppIcon size={26} />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-gray-800"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-orange-600"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={BOOK_RIDE_HREF}
              onClick={close}
              className="mt-1 rounded-lg bg-orange-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-orange-700"
            >
              Book Ride
            </Link>
            <div className="mt-2 border-t border-gray-100 pt-2">
              <AuthMenu />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Navbar} from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.matoshreecabs.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Matoshree Cabs — Cabs from Pune for Outstation, Airport & Local Trips",
    template: "%s | Matoshree Cabs",
  },
  description:
    "Book cabs from Pune for local, outstation, airport, and rental trips. Clean cars, fixed fares, and reliable drivers — Pune to Mumbai, Nashik, Nagpur and more.",
  keywords: [
    "Matoshree Cabs",
    "cabs from Pune",
    "Pune to Mumbai cab",
    "Pune airport taxi",
    "outstation cab Pune",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Matoshree Cabs",
    url: SITE_URL,
    title: "Matoshree Cabs — Cabs from Pune",
    description:
      "Book cabs from Pune for local, outstation, airport, and rental trips.",
  },
  verification: {
    google: "rr2ywrz9-4g8MHPWFCY9_WPrV3PRktd0myn-bFMLNmo",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
           <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

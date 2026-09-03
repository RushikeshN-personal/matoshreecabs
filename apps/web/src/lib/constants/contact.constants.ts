import { SITE } from "./site.constants";

export const CONTACT_HEADING = "Get in touch";
export const CONTACT_INTRO =
  "Questions about a trip, a quote, or a booking? Reach us any time — we usually reply within a few minutes during the day.";

export interface ContactMethod {
  icon: "phone" | "mail" | "whatsapp" | "pin";
  label: string;
  value: string;
  href?: string;
}

export const CONTACT_METHODS: ContactMethod[] = [
  { icon: "phone", label: "Call us", value: SITE.phoneDisplay, href: `tel:${SITE.phone}` },
  { icon: "whatsapp", label: "WhatsApp", value: "Chat with us", href: `https://wa.me/${SITE.whatsapp}` },
  { icon: "mail", label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: "pin", label: "Base", value: "Pune, Maharashtra" },
];

// Subjects for the enquiry dropdown
export const CONTACT_SUBJECTS = [
  "General enquiry",
  "Book a trip",
  "Fare / quote",
  "Existing booking",
  "Feedback",
] as const;
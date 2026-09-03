export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Why Matoshree Cabs", href: "/why" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Our Cabs", href: "/cabs" },
      { label: "Price Catalog", href: "/price-catalog" },
      { label: "Top Locations", href: "/#trips" },
      { label: "Reviews", href: "/#reviews" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My Bookings", href: "/my-bookings" },
      { label: "Track Booking", href: "/track-booking" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];
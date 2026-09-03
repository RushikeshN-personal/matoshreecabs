export interface NavLink {
  label: string;
  href: string;
}

// Marketing tabs are anchor links on the home page (built next).
export const NAV_LINKS: NavLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Top Locations", href: "/#trips" },
  { label: "Cabs", href: "/cabs" },
  { label: "Services", href: "/services" },
  // { label: "Track Booking", href: "/track-booking" },
];

// Login and the booking flow are separate pages.
// The booking form lives on the home hero — there's no standalone /book page.
export const BOOK_RIDE_HREF = "/#home";
export const LOGIN_HREF = "/login";
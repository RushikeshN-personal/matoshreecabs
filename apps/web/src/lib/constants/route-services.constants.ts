export interface RouteService {
  slug: string;
  label: string;
  fromCity: string;
  toCity: string;
}

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function route(label: string, fromCity: string, toCity: string): RouteService {
  return { slug: slugify(label), label, fromCity, toCity };
}

// The long-tail "A to B cab" links shown in the footer's Services panel —
// each resolves to a templated /services/[slug] page built from fromCity/toCity.
export const ROUTE_SERVICES: RouteService[] = [
  // Pune <-> Mumbai — the core route, several query variants
  route("Pune to Mumbai Cab", "Pune", "Mumbai"),
  route("Pune to Mumbai Airport Cab", "Pune", "Mumbai Airport"),
  route("Pune to Mumbai International Airport Cab", "Pune", "Mumbai Airport"),
  route("Pune to Mumbai One Way Cab", "Pune", "Mumbai"),
  route("Pune Mumbai Car Hire", "Pune", "Mumbai"),
  route("Pune to Mumbai Taxi Fare", "Pune", "Mumbai"),
  route("Pune to Mumbai Online Cab Booking", "Pune", "Mumbai"),
  route("Pune to Mumbai Ertiga Cab", "Pune", "Mumbai"),

  // Pune localities -> Mumbai
  route("Pimpri Chinchwad to Mumbai Cab", "Pimpri-Chinchwad", "Mumbai"),
  route("Baner to Mumbai Cabs", "Baner", "Mumbai"),
  route("Hinjewadi to Mumbai Cab", "Hinjewadi", "Mumbai"),
  route("Pimple Saudagar to Mumbai Cab Service", "Pimple Saudagar", "Mumbai"),
  route("Wakad to Mumbai Cab", "Wakad", "Mumbai"),
  route("Hadapsar to Mumbai Cab", "Hadapsar", "Mumbai"),
  route("Kalyani Nagar to Mumbai Taxi", "Kalyani Nagar", "Mumbai"),
  route("Koregaon Park to Mumbai Cab", "Koregaon Park", "Mumbai"),
  route("Kothrud to Mumbai Cab", "Kothrud", "Mumbai"),
  route("Kharadi to Mumbai Cab", "Kharadi", "Mumbai"),
  route("Shivajinagar to Mumbai Cab", "Shivajinagar", "Mumbai"),
  route("Vishrantwadi to Mumbai Cab", "Vishrantwadi", "Mumbai"),
  route("Alandi to Mumbai Cabs Service", "Alandi", "Mumbai"),
  route("Boat Club Road to Mumbai Cab", "Boat Club Road", "Mumbai"),

  // Mumbai (incl. suburbs) -> Pune
  route("Bhandup to Pune Cab", "Bhandup", "Pune"),
  route("Ghatkopar to Pune Cab Service", "Ghatkopar", "Pune"),
  route("Kurla to Pune Taxi Service", "Kurla", "Pune"),
  route("Powai Mumbai Pune Cab Service", "Powai", "Pune"),
  route("Chembur to Pune Cab", "Chembur", "Pune"),
  route("Terminal 1,2,3 Mumbai Airport to Pune Cab", "Mumbai Airport", "Pune"),
  route("Thane to Pune Cab", "Thane", "Pune"),
  route("Vikhroli to Pune Cab Services", "Vikhroli", "Pune"),
  route("Mumbai to Pune Innova Crysta Cab", "Mumbai", "Pune"),
  route("Mumbai to Pimpri Chinchwad Cab", "Mumbai", "Pimpri-Chinchwad"),
  route("Mumbai to Pune One Way Cab", "Mumbai", "Pune"),
  route("Andheri to Pune Cab", "Andheri", "Pune"),
  route("Bandra to Pune Cab", "Bandra", "Pune"),
  route("Santacruz to Pune Cab", "Santacruz", "Pune"),
  route("Mumbai Central to Pune Cab", "Mumbai Central", "Pune"),
  route("Borivali to Pune Cab", "Borivali", "Pune"),

  // Other Maharashtra cities — mainly Pune <-> city, plus a couple of
  // city-to-city examples that don't touch Pune at all.
  route("Pune to Nashik Cab", "Pune", "Nashik"),
  route("Nashik to Pune Cab", "Nashik", "Pune"),
  route("Pune to Nagpur Cab", "Pune", "Nagpur"),
  route("Nagpur to Pune Cab", "Nagpur", "Pune"),
  route("Pune to Satara Cab", "Pune", "Satara"),
  route("Satara to Pune Cab", "Satara", "Pune"),
  route("Satara to Mumbai Cab", "Satara", "Mumbai"),
  route("Pune to Sangli Cab", "Pune", "Sangli"),
  route("Sangli to Pune Cab", "Sangli", "Pune"),
  route("Pune to Solapur Cab", "Pune", "Solapur"),
  route("Solapur to Pune Cab", "Solapur", "Pune"),
  route("Pune to Kolhapur Cab", "Pune", "Kolhapur"),
  route("Kolhapur to Pune Cab", "Kolhapur", "Pune"),
  route("Kolhapur to Satara Cab", "Kolhapur", "Satara"),
  route("Pune to Nanded Cab", "Pune", "Nanded"),
  route("Nanded to Pune Cab", "Nanded", "Pune"),

  // From Navi Mumbai
  route("Navi Mumbai to Pune", "Navi Mumbai", "Pune"),
  route("Navi Mumbai to Lonavala", "Navi Mumbai", "Lonavala"),
  route("Navi Mumbai to Mulshi", "Navi Mumbai", "Mulshi"),
  route("Navi Mumbai to Karjat", "Navi Mumbai", "Karjat"),
  route("Navi Mumbai to Khopoli", "Navi Mumbai", "Khopoli"),
  route("Navi Mumbai to Mahabaleshwar", "Navi Mumbai", "Mahabaleshwar"),
  route("Navi Mumbai to Goa", "Navi Mumbai", "Goa"),
  route("Navi Mumbai to Nashik", "Navi Mumbai", "Nashik"),
  route("Navi Mumbai to Igatpuri", "Navi Mumbai", "Igatpuri"),
  route("Navi Mumbai to Shirdi", "Navi Mumbai", "Shirdi"),
  route("Navi Mumbai to Mumbai", "Navi Mumbai", "Mumbai"),
  route("Navi Mumbai to Thane", "Navi Mumbai", "Thane"),
  route("Navi Mumbai to Kalyan", "Navi Mumbai", "Kalyan"),
  route("Navi Mumbai to Mumbai Airport", "Navi Mumbai", "Mumbai Airport"),

  // From Nashik
  route("Nashik to Mumbai", "Nashik", "Mumbai"),
  route("Nashik to Pune", "Nashik", "Pune"),
  route("Nashik to Thane", "Nashik", "Thane"),
  route("Nashik to Navi Mumbai", "Nashik", "Navi Mumbai"),
  route("Nashik to Kalyan", "Nashik", "Kalyan"),
  route("Nashik to Igatpuri", "Nashik", "Igatpuri"),
  route("Nashik to Shirdi", "Nashik", "Shirdi"),
  route("Nashik to Goa", "Nashik", "Goa"),
  route("Nashik to Mahabaleshwar", "Nashik", "Mahabaleshwar"),
  route("Nashik to Karjat", "Nashik", "Karjat"),
  route("Nashik to Lonavala", "Nashik", "Lonavala"),
  route("Nashik to Khopoli", "Nashik", "Khopoli"),
  route("Nashik to Mulshi", "Nashik", "Mulshi"),

  // From Mumbai Airport
  route("Mumbai Airport to Mumbai", "Mumbai Airport", "Mumbai"),
  route("Mumbai Airport to South Mumbai", "Mumbai Airport", "South Mumbai"),
  route("Mumbai Airport to Mira Road", "Mumbai Airport", "Mira Road"),
  route("Mumbai Airport to Thane", "Mumbai Airport", "Thane"),
  route("Mumbai Airport to Navi Mumbai", "Mumbai Airport", "Navi Mumbai"),
  route("Mumbai Airport to Kalyan", "Mumbai Airport", "Kalyan"),

  // From South Mumbai / Mira Road / Mumbai / Kalyan / Thane — single airport legs
  route("South Mumbai to Mumbai Airport", "South Mumbai", "Mumbai Airport"),
  route("Mira Road to Mumbai Airport", "Mira Road", "Mumbai Airport"),
  route("Mumbai to Mumbai Airport", "Mumbai", "Mumbai Airport"),
  route("Kalyan to Mumbai Airport", "Kalyan", "Mumbai Airport"),
  route("Thane to Mumbai Airport", "Thane", "Mumbai Airport"),

  // From Pune Airport / Kondhwa / Pune Railway Station
  route("Pune Airport to Kondhwa", "Pune Airport", "Kondhwa"),
  route("Pune Airport to Pune Railway Station", "Pune Airport", "Pune Railway Station"),
  route("Pune Airport to Hinjewadi", "Pune Airport", "Hinjewadi"),
  route("Pune Airport to Pimpri Chinchwad", "Pune Airport", "Pimpri Chinchwad"),
  route("Kondhwa to Pune Airport", "Kondhwa", "Pune Airport"),
  route("Pune Railway Station to Pune Airport", "Pune Railway Station", "Pune Airport"),
];

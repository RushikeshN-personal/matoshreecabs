export interface DestinationStop {
  id: string;
  label: string;
  city: string; // parent city, used to group the dropdown and to block "same city" trips
}

// Drop-off points offered in the booking form, grouped by city. Cities with
// no named sub-stops just get a single city-level entry.
export const DESTINATION_STOPS: DestinationStop[] = [
  // Mumbai + sub-stops
  { id: 'mumbai', label: 'Mumbai (City Centre)', city: 'Mumbai' },
  { id: 'mumbai-dadar', label: 'Dadar', city: 'Mumbai' },
  { id: 'mumbai-kalyan', label: 'Kalyan', city: 'Mumbai' },
  { id: 'mumbai-andheri', label: 'Andheri', city: 'Mumbai' },
  { id: 'mumbai-borivali', label: 'Borivali', city: 'Mumbai' },
  { id: 'mumbai-bandra', label: 'Bandra', city: 'Mumbai' },
  { id: 'mumbai-thane', label: 'Thane', city: 'Mumbai' },
  { id: 'mumbai-navi-mumbai', label: 'Navi Mumbai', city: 'Mumbai' },
  { id: 'mumbai-airport', label: 'Mumbai Airport', city: 'Mumbai' },
  { id: 'mumbai-mira-road', label: 'Mira Road', city: 'Mumbai' },
  { id: 'mumbai-south-mumbai', label: 'South Mumbai', city: 'Mumbai' },

  // Pune + sub-stops
  { id: 'pune', label: 'Pune (City Centre)', city: 'Pune' },
  { id: 'pune-railway-station', label: 'Pune Railway Station', city: 'Pune' },
  { id: 'akurdi-railway-station', label: 'Akurdi Railway Station', city: 'Pune' },
  { id: 'pimple-saudagar', label: 'Pimple Saudagar', city: 'Pune' },
  { id: 'hinjewadi', label: 'Hinjewadi', city: 'Pune' },
  { id: 'shivajinagar', label: 'Shivajinagar', city: 'Pune' },
  { id: 'kharadi', label: 'Kharadi', city: 'Pune' },
  { id: 'pune-airport', label: 'Pune Airport', city: 'Pune' },
  { id: 'kondhwa', label: 'Kondhwa', city: 'Pune' },
  { id: 'pimpri-chinchwad-stop', label: 'Pimpri Chinchwad', city: 'Pune' },

  // Nashik + sub-stops
  { id: 'nashik', label: 'Nashik (City Centre)', city: 'Nashik' },
  { id: 'nashik-road-railway-station', label: 'Nashik Road Railway Station', city: 'Nashik' },
  { id: 'trimbakeshwar', label: 'Trimbakeshwar', city: 'Nashik' },

  // Satara + sub-stops
  { id: 'satara', label: 'Satara (City Centre)', city: 'Satara' },
  { id: 'satara-bus-stand', label: 'Satara Bus Stand', city: 'Satara' },
  { id: 'karad', label: 'Karad', city: 'Satara' },

  // Other single-stop cities
  { id: 'navi-mumbai', label: 'Navi Mumbai', city: 'Navi Mumbai' },
  { id: 'thane', label: 'Thane', city: 'Thane' },
  { id: 'nagpur', label: 'Nagpur', city: 'Nagpur' },
  { id: 'nanded', label: 'Nanded', city: 'Nanded' },
  { id: 'kolhapur', label: 'Kolhapur', city: 'Kolhapur' },
  { id: 'solapur', label: 'Solapur', city: 'Solapur' },
  { id: 'sangli', label: 'Sangli', city: 'Sangli' },
  { id: 'lonavala', label: 'Lonavala', city: 'Lonavala' },
  { id: 'karjat', label: 'Karjat', city: 'Karjat' },
  { id: 'khopoli', label: 'Khopoli', city: 'Khopoli' },
  { id: 'mulshi', label: 'Mulshi', city: 'Mulshi' },
  { id: 'mahabaleshwar', label: 'Mahabaleshwar', city: 'Mahabaleshwar' },
  { id: 'goa', label: 'Goa', city: 'Goa' },
  { id: 'igatpuri', label: 'Igatpuri', city: 'Igatpuri' },
  { id: 'shirdi', label: 'Shirdi', city: 'Shirdi' },
];

export function findDestinationStop(id: string): DestinationStop | undefined {
  return DESTINATION_STOPS.find((s) => s.id === id);
}

export interface LocationInfo {
  image: string;
  blurb: string;
}

// Photos: Wikimedia Commons (CC BY-SA), hotlink-safe. Reused from the hero
// slider / Top Locations section where the same city already has one.
export const PUNE_IMAGE =
  "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/fallback_image/generic_pune_fallback.png";
export const MUMBAI_IMAGE =
  "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/fallback_image/generic_mumbai_fallback.png";

// Named places with a specific photo + blurb. Anything not listed here falls
// back to its parent city's image (see `resolveLocationInfo`) with a generic
// blurb — writing genuinely unique content and sourcing a distinct photo for
// every Pune locality / Mumbai suburb is out of scope for a first pass.
export const LOCATION_INFO: Record<string, LocationInfo> = {
  Pune: {
    image: PUNE_IMAGE,
    blurb:
      "Pune is Maharashtra's second-largest city and Matoshree Cabs' home base — every trip starts here.",
  },
  Mumbai: {
    image: MUMBAI_IMAGE,
    blurb:
      "Mumbai, India's financial capital, is about 150 km from Pune via the Mumbai-Pune Expressway — a 2.5-3 hour drive in normal traffic.",
  },
  "Mumbai Airport": {
    image: MUMBAI_IMAGE,
    blurb:
      "Chhatrapati Shivaji Maharaj International Airport (Terminals 1 & 2) is Mumbai's main airport — a common pickup/drop point on the Pune-Mumbai route.",
  },
  Thane: {
    image:
      "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/top_cities/thane.png",
    blurb: "Thane, the \"City of Lakes\", sits just north of Mumbai and is a major hub in its own right.",
  },
  "Navi Mumbai": {
    image:
      "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/top_cities/navi_mumbai.png",
    blurb: "Navi Mumbai is a planned satellite city across Thane Creek from Mumbai.",
  },
  "Pimpri-Chinchwad": {
    image: PUNE_IMAGE,
    blurb: "Pimpri-Chinchwad is Pune's industrial twin city, adjoining Pune to the northwest.",
  },

  // Other Maharashtra cities served on outstation routes
  Nashik: {
    image:
      "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/top_cities/nashik.png",
    blurb:
      "Nashik, on the banks of the Godavari river, is known for its temples, vineyards, and the Trimbakeshwar-Shirdi pilgrimage circuit.",
  },
  Nagpur: {
    image:
      "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/top_cities/nagpur.png",
    blurb: "Nagpur, Maharashtra's second capital, sits at the geographical centre of India.",
  },
  Satara: {
    image:
      "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/top_cities/satara.png",
    blurb:
      "Satara, overlooked by the historic Ajinkyatara Fort, is a convenient stop en route to Mahabaleshwar and Kas Plateau.",
  },
  Sangli: {
    image:
      "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/top_cities/sangli.png",
    blurb: "Sangli, on the banks of the Krishna river, is known for its sugar and turmeric trade.",
  },
  Solapur: {
    image:
      "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/top_cities/solapur.png",
    blurb: "Solapur, home to the historic Bhuikot Fort, is a major textile hub on the Pune-Hyderabad highway.",
  },
  Kolhapur: {
    image:
      "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/top_cities/kolhapur.png",
    blurb: "Kolhapur is known for the Mahalakshmi Temple, its cuisine, and Kolhapuri leatherwork.",
  },
  Nanded: {
    image:
      "https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/top_cities/nanded.png",
    blurb: "Nanded, on the Godavari, is home to Hazur Sahib, one of Sikhism's five Takhts.",
  },

  // Pune-area localities
  Baner: { image: PUNE_IMAGE, blurb: "Baner is an upscale residential and commercial locality in western Pune." },
  Hinjewadi: { image: PUNE_IMAGE, blurb: "Hinjewadi is Pune's largest IT hub, home to Rajiv Gandhi Infotech Park." },
  "Pimple Saudagar": { image: PUNE_IMAGE, blurb: "Pimple Saudagar is a fast-growing residential locality near Pimpri-Chinchwad." },
  Wakad: { image: PUNE_IMAGE, blurb: "Wakad is a major residential locality adjoining the Hinjewadi IT corridor." },
  Hadapsar: { image: PUNE_IMAGE, blurb: "Hadapsar is a residential and IT/industrial hub in eastern Pune." },
  "Kalyani Nagar": { image: PUNE_IMAGE, blurb: "Kalyani Nagar is an upscale locality close to Pune Airport." },
  "Koregaon Park": { image: PUNE_IMAGE, blurb: "Koregaon Park is one of Pune's most upscale residential and nightlife areas." },
  Kothrud: { image: PUNE_IMAGE, blurb: "Kothrud is one of Pune's largest and most established residential localities." },
  Kharadi: { image: PUNE_IMAGE, blurb: "Kharadi is a major IT hub in eastern Pune, home to EON and World Trade Center." },
  Shivajinagar: { image: PUNE_IMAGE, blurb: "Shivajinagar is central Pune's administrative and commercial core." },
  Vishrantwadi: { image: PUNE_IMAGE, blurb: "Vishrantwadi is a residential locality in northern Pune, on the way to Alandi." },
  Alandi: { image: PUNE_IMAGE, blurb: "Alandi, on the Indrayani river, is a major pilgrimage town just north of Pune." },
  "Boat Club Road": { image: PUNE_IMAGE, blurb: "Boat Club Road is an upscale residential road in central Pune." },
  Kondhwa: { image: PUNE_IMAGE, blurb: "Kondhwa is a large residential locality in south-east Pune, close to NIBM Road." },
  "Pimpri Chinchwad": { image: PUNE_IMAGE, blurb: "Pimpri-Chinchwad is Pune's industrial twin city, adjoining Pune to the northwest." },
  "Pune Railway Station": { image: PUNE_IMAGE, blurb: "Pune Junction, the city's main railway station, is a common pickup and drop point in central Pune." },
  "Pune Airport": { image: PUNE_IMAGE, blurb: "Pune Airport (Lohegaon) is Pune's domestic and international airport, on the city's north-east side." },

  // Hill stations and leisure destinations reachable from Pune/Mumbai
  Lonavala: { image: PUNE_IMAGE, blurb: "Lonavala is a popular hill station on the Mumbai-Pune Expressway, known for its viewpoints and monsoon waterfalls." },
  Karjat: { image: PUNE_IMAGE, blurb: "Karjat is a Sahyadri hill town near Mumbai, popular for weekend getaways and trekking." },
  Khopoli: { image: PUNE_IMAGE, blurb: "Khopoli sits at the base of the Western Ghats on the old Mumbai-Pune highway, near Imagica and the Bhaja caves." },
  Mulshi: { image: PUNE_IMAGE, blurb: "Mulshi, west of Pune, is known for its lake, dam, and scenic backwater views." },
  Mahabaleshwar: { image: PUNE_IMAGE, blurb: "Mahabaleshwar is Maharashtra's best-known hill station, famous for its viewpoints and strawberry farms." },
  Goa: { image: PUNE_IMAGE, blurb: "Goa, India's beach state on the Konkan coast, is a longer outstation drive from Pune or Mumbai." },
  Igatpuri: { image: PUNE_IMAGE, blurb: "Igatpuri, in the Sahyadris near Nashik, is known for its monsoon trekking and the Bhandardara-Ghatandevi range." },
  Shirdi: { image: PUNE_IMAGE, blurb: "Shirdi, home to the Sai Baba temple, is one of Maharashtra's most-visited pilgrimage towns." },

  // Mumbai-area localities/suburbs
  Bhandup: { image: MUMBAI_IMAGE, blurb: "Bhandup is a residential and industrial suburb in eastern Mumbai." },
  Ghatkopar: { image: MUMBAI_IMAGE, blurb: "Ghatkopar is a major eastern-suburb hub and a key Mumbai Metro interchange." },
  Kurla: { image: MUMBAI_IMAGE, blurb: "Kurla is a central Mumbai suburb and a major railway junction." },
  Powai: { image: MUMBAI_IMAGE, blurb: "Powai is a business and IT hub around Powai Lake, home to IIT Bombay." },
  Chembur: { image: MUMBAI_IMAGE, blurb: "Chembur is a well-connected residential suburb in eastern Mumbai." },
  Vikhroli: { image: MUMBAI_IMAGE, blurb: "Vikhroli is an eastern Mumbai suburb, home to the Godrej industrial estate." },
  Andheri: { image: MUMBAI_IMAGE, blurb: "Andheri is one of Mumbai's largest business hubs, close to the domestic airport." },
  Bandra: { image: MUMBAI_IMAGE, blurb: "Bandra is an upscale western-suburb neighbourhood, often called the \"Queen of the Suburbs\"." },
  Santacruz: { image: MUMBAI_IMAGE, blurb: "Santacruz is a western suburb next to Mumbai's domestic airport terminal." },
  "Mumbai Central": { image: MUMBAI_IMAGE, blurb: "Mumbai Central is a major railway terminus and business district." },
  Borivali: { image: MUMBAI_IMAGE, blurb: "Borivali is a northern Mumbai suburb next to Sanjay Gandhi National Park." },
  Kalyan: { image: MUMBAI_IMAGE, blurb: "Kalyan is a major hub in the north-eastern Mumbai Metropolitan Region, on the Central and Kalyan-Kasara lines." },
  "Mira Road": { image: MUMBAI_IMAGE, blurb: "Mira Road is a fast-growing residential suburb at Mumbai's northern edge, past Borivali." },
  "South Mumbai": { image: MUMBAI_IMAGE, blurb: "South Mumbai (\"SoBo\") is the city's original core — Colaba, Fort, Marine Drive and the business district." },
};

export function resolveLocationInfo(name: string): LocationInfo {
  if (LOCATION_INFO[name]) return LOCATION_INFO[name];
  // Fall back by parent city: anything ending in "Mumbai" uses the Mumbai
  // image; everything else defaults to Pune, since most of our routes are
  // Pune-area localities.
  const isMumbaiArea = /mumbai/i.test(name);
  return {
    image: isMumbaiArea ? MUMBAI_IMAGE : PUNE_IMAGE,
    blurb: `${name} is one of the pickup and drop points Matoshree Cabs regularly serves.`,
  };
}

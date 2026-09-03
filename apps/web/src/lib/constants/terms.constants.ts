export const TERMS_LAST_UPDATED = "30 August 2026";

export interface TermsSection {
  title: string;
  body: string[];
}

export const TERMS_SECTIONS: TermsSection[] = [
  {
    title: "1. Acceptance of these terms",
    body: [
      "These Terms & Conditions govern your use of the Matoshree Cabs website and booking service (\"the Service\"). By requesting a booking, creating an account, or otherwise using the Service, you agree to these terms. If you don't agree, please don't use the Service.",
    ],
  },
  {
    title: "2. About the Service",
    body: [
      "Matoshree Cabs provides local, outstation, airport, and rental cab bookings with pickup from Pune and other listed cities. Submitting a booking request creates a request for a cab — it is not automatically confirmed. We assign a driver and confirm the trip separately; you'll see the booking's status update accordingly.",
      "You do not need an account to book — guest bookings are supported using your name and mobile number. Creating an account lets you track and manage your bookings in one place.",
    ],
  },
  {
    title: "3. Fares, estimates & payment",
    body: [
      "The fare shown at booking is an estimate based on the trip mode, vehicle, and rate card in effect at the time — it is not a final invoice. The actual fare may vary based on the real distance travelled, time taken, tolls, or waiting time, and is settled directly with your driver at the end of the trip.",
      "No advance payment or online payment is required to book. You pay the driver directly — by cash or UPI — once the trip is completed. We do not process or store any card or payment details.",
      "If you provide a GST number when booking, it is recorded against your trip for your own invoicing purposes; we do not issue a formal tax invoice through the Service.",
    ],
  },
  {
    title: "4. Cancellations",
    body: [
      "You may cancel a booking before it's confirmed or while it's still pending, from My Bookings (if you have an account) or by looking it up on the Track Booking page using your reference and mobile number.",
      "Because no advance payment is collected at booking, cancelling has no refund to process — there is simply nothing charged yet. We do ask that you cancel as early as you can if your plans change, out of courtesy to the driver who may otherwise be held for your trip.",
      "We reserve the right to decline future bookings from riders with a pattern of repeated last-minute cancellations or no-shows.",
    ],
  },
  {
    title: "5. Driver assignment & reassignment",
    body: [
      "A specific driver and vehicle are assigned to your trip after your request is confirmed. If your assigned driver becomes unavailable or cancels, we'll try to reassign your trip to another driver and will let you know if we're unable to.",
      "Drivers on the platform are onboarded and verified by us before being assigned trips. If you have any concern about a driver or vehicle, please contact us using the details below.",
    ],
  },
  {
    title: "6. Your responsibilities",
    body: [
      "Please provide accurate pickup, destination, and contact details when booking — incorrect information can delay or prevent your pickup. Be ready at the pickup point at the agreed time; excessive waiting may be treated as a no-show.",
      "You're responsible for your own belongings during the trip. Please don't ask a driver to carry items, routes, or passenger counts beyond what was booked without checking with us first, as this may affect the fare or vehicle suitability.",
    ],
  },
  {
    title: "7. Vehicles & luggage capacity",
    body: [
      "Each vehicle listed has a maximum seating capacity, shown at booking. Bookings exceeding a vehicle's capacity aren't accepted — please choose a larger vehicle or split your group across more than one cab.",
    ],
  },
  {
    title: "8. Limitation of liability",
    body: [
      "We work to connect you with a reliable driver and vehicle for your trip, but Matoshree Cabs is not liable for delays, losses, or damages arising from traffic conditions, weather, road closures, or circumstances outside our reasonable control. Nothing in these terms limits liability that cannot be excluded under Indian law.",
    ],
  },
  {
    title: "9. Your data",
    body: [
      "We collect the booking details you provide (name, mobile, email, trip details) to process your ride and, if applicable, associate it with your account. We don't sell your personal data. See our Privacy Policy for the full details on how your information is handled.",
    ],
  },
  {
    title: "10. Changes to these terms",
    body: [
      `We may update these terms from time to time as the Service changes. The "last updated" date at the top of this page reflects the most recent revision. Continuing to use the Service after an update means you accept the revised terms.`,
    ],
  },
  {
    title: "11. Governing law",
    body: [
      "These terms are governed by the laws of India, and any disputes are subject to the jurisdiction of the courts in Pune, Maharashtra.",
    ],
  },
];

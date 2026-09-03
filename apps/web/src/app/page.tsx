import { HeroSection } from "@/components/home/hero-section";
import { ServicesStrip } from "@/components/home/services-strip";
import { CarCollection } from "@/components/home/car-collection";
import { DestinationSection } from "@/components/home/destination-section";
import { ReviewsSection } from "@/components/reviews/reviews-section";
import { TOP_LOCATIONS, TOP_LOCATIONS_HEADING } from "@/lib/constants/trips.constants";
import { HILL_STATIONS, HILL_STATIONS_HEADING } from "@/lib/constants/hilstations";
import { RELIGIOUS_PLACES, RELIGIOUS_PLACES_HEADING } from "@/lib/constants/religious";
import { BEACH_DESTINATIONS, BEACH_DESTINATIONS_HEADING } from "@/lib/constants/beach";

export default function Home() {
  return (
   <>
      <HeroSection />
       <ServicesStrip />
       <CarCollection />
       <DestinationSection
        id="trips"
        heading={TOP_LOCATIONS_HEADING}
        items={TOP_LOCATIONS}
        tone="dark"
      />
       <DestinationSection
        id="hill-stations"
        heading={HILL_STATIONS_HEADING}
        items={HILL_STATIONS}
        tone="light"
      />
       <DestinationSection
        id="religious-places"
        heading={RELIGIOUS_PLACES_HEADING}
        items={RELIGIOUS_PLACES}
        tone="dark"
      />
       <DestinationSection
        id="beaches"
        heading={BEACH_DESTINATIONS_HEADING}
        items={BEACH_DESTINATIONS}
        tone="light"
      />
       <ReviewsSection />
    </>
  );
}

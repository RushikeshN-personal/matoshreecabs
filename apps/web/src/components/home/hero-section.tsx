import { BackgroundScroller } from "./background-scroller";
import { BookingForm } from "./booking-form";
import { RotatingCity } from "./rotating-city";
import {
  HERO_HEADING_PREFIX,
  HERO_HEADING_SUFFIX,
  HERO_SUBHEADING,
} from "@/lib/constants/hero.constants";

export function HeroSection() {
  return (
    <section id="home" className="relative">
      <BackgroundScroller />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div className="text-white">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            {HERO_HEADING_PREFIX} <RotatingCity />, {HERO_HEADING_SUFFIX}
          </h1>
          <p className="mt-4 max-w-md text-lg text-white/90">
            {HERO_SUBHEADING}
          </p>
        </div>
        <BookingForm />
      </div>
    </section>
  );
}
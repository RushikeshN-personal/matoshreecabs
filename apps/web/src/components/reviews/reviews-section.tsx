import {
  REVIEWS_HEADING,
  REVIEWS_BG,
  DEMO_REVIEWS,
} from "@/lib/constants/reviews.constants";
import { fetchReviews } from "@/lib/api/reviews";
import { Stars } from "./stars";

interface Card {
  name: string;
  rating: number;
  text: string;
}

export async function ReviewsSection() {
  let cards: Card[];
  try {
    const api = await fetchReviews();
    cards = api.length
      ? api.map((r) => ({
          name: r.customer?.name ?? "Customer",
          rating: r.rating,
          text: r.text ?? "",
        }))
      : DEMO_REVIEWS;
  } catch {
    cards = DEMO_REVIEWS;
  }

  return (
    <section id="reviews" className="relative overflow-hidden py-24">
      {/* background image + gradient fallback */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url(${REVIEWS_BG}), linear-gradient(120deg,#7c2d12,#ea580c)`,
        }}
      />
      {/* overlay so white cards + heading stay readable */}
      <div className="absolute inset-0 -z-10 bg-black/60" />

      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            {REVIEWS_HEADING}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Real experiences from travellers who ride with Matoshree Cabs across Pune and beyond.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <figure
              key={i}
              className="flex h-full flex-col rounded-2xl bg-white/95 p-6 shadow-xl backdrop-blur"
            >
              <Stars rating={c.rating} />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-gray-700">
                “{c.text}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-gray-900">
                {c.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
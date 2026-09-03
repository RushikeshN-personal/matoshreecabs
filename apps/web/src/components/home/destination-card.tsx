import type { Destination } from "@/lib/constants/destination.types";

export function DestinationCard({ item }: { item: Destination }) {
  return (
    <article className="w-[300px] shrink-0 overflow-hidden rounded-2xl bg-white shadow-xl">
      <div
        className="h-40 w-full bg-cover bg-center"
        style={{
          backgroundImage: item.image
            ? `url(${item.image}), linear-gradient(120deg,#9a3412,#f97316)`
            : "linear-gradient(120deg,#9a3412,#f97316)",
        }}
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-5">
          {item.location_details}
        </p>
      </div>
    </article>
  );
}

"use client";

import { useState } from "react";

export function CabGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const gallery = images.length > 0 ? images : [];
  const current = gallery[active];

  return (
    <div>
      <div
        className="h-72 w-full rounded-2xl bg-gray-100 bg-cover bg-center sm:h-96"
        style={{
          backgroundImage: current
            ? `url(${current}), linear-gradient(120deg,#9a3412,#f97316)`
            : "linear-gradient(120deg,#9a3412,#f97316)",
        }}
      />

      {gallery.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {gallery.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${alt} photo ${i + 1}`}
              className={
                "h-16 w-24 shrink-0 rounded-lg bg-cover bg-center ring-2 transition " +
                (i === active ? "ring-orange-600" : "ring-transparent opacity-70 hover:opacity-100")
              }
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

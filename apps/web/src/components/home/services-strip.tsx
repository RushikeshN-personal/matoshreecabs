import { SERVICES, type ServiceIcon } from "@/lib/constants/services.constants";

function Icon({ name }: { name: ServiceIcon }) {
  const common = {
    className: "h-10 w-10",
    fill: "url(#matoshreecabsOrange)",
    "aria-hidden": true as const,
  };

  if (name === "airport") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16Z" />
      </svg>
    );
  }
  if (name === "intercity") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M12 2C8.1 2 5 5.1 5 9c0 5 7 13 7 13s7-8 7-13c0-3.9-3.1-7-7-7Zm-3.2 8 .7-2.2A1 1 0 0 1 10.4 7h3.2a1 1 0 0 1 .95.68l.7 2.32H8.8Zm.7 2.5a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Zm5 0a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Z" />
      </svg>
    );
  }
  // outstation
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <path d="M9 2 3 4v18l6-2 6 2 6-2V2l-6 2-6-2Zm7 15.2-4-1.33V4.8l4 1.33V17.2Zm3-.66V5.2l1.4-.47v11.34L19 16.54ZM5 5.46l2-.66v11.07l-2 .67V5.46Z" />
      <circle cx="17" cy="12" r="3" fill="#fff" opacity="0.15" />
    </svg>
  );
}

export function ServicesStrip() {
  return (
    <section id="services" className="bg-gradient-to-b from-white to-orange-50/40">
      {/* orange gradient used by the icons' fill */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <linearGradient id="matoshreecabsOrange" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
      </svg>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-center gap-4 sm:justify-start"
            >
              <Icon name={s.icon} />
              <span className="text-lg font-semibold text-gray-800">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
import type { RentalIcon } from "@/lib/constants/rental-services.constants";

const common = {
  className: "h-8 w-8",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

function Icon({ name }: { name: RentalIcon }) {
  switch (name) {
    case "economy":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 4v3M12 17v3M4 12h3M17 12h3" />
        </svg>
      );
    case "luxury":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M3 16v-3l2-4a2 2 0 0 1 1.9-1.3h10.2A2 2 0 0 1 19 9l2 4v3" />
          <path d="M3 16h18M6 16v2M18 16v2" />
          <circle cx="7.5" cy="16" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="16.5" cy="16" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "event":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M3 17v-4l2-4a2 2 0 0 1 1.9-1.3h6.2A2 2 0 0 1 15 9l1.5 3.3" />
          <path d="M3 17h13M6 17v2M17 13a3 3 0 1 1 4 2.8" />
          <circle cx="7.5" cy="17" r="1.3" fill="currentColor" stroke="none" />
        </svg>
      );
    case "corporate":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="6" y="4" width="4" height="16" rx="0.5" />
          <path d="M10 8h4M10 12h4M10 16h4" />
          <path d="M14 20V9l6 2v9Z" />
        </svg>
      );
    case "local":
    default:
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10Z" />
          <circle cx="12" cy="11" r="2.3" />
        </svg>
      );
  }
}

export function RentalIconBadge({ name }: { name: RentalIcon }) {
  return (
    <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-orange-300 text-orange-600">
      <Icon name={name} />
    </span>
  );
}

import type { WhyFeature } from "@/lib/constants/why.constants";

export function WhyIcon({ name }: { name: WhyFeature["icon"] }) {
  const cls = "h-7 w-7 text-orange-600";
  const paths: Record<WhyFeature["icon"], string> = {
    shield: "M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5l-8-3Zm0 2.2 6 2.25V11c0 3.9-2.5 7.4-6 8.9-3.5-1.5-6-5-6-8.9V6.45L12 4.2Z",
    rupee: "M7 4h10v2h-3.1c.4.5.7 1.2.8 2H17v2h-2.3c-.4 2.3-2.3 4-4.7 4H9.4l5.6 6h-2.8L6 13.9V12h4c1.3 0 2.4-.8 2.8-2H7V8h5.8c-.4-1.2-1.5-2-2.8-2H7V4Z",
    clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 2a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm-1 3v5l4 2 .8-1.6L13 12V8h-2Z",
    headset: "M12 3a8 8 0 0 0-8 8v5a3 3 0 0 0 3 3h1v-7H6v-1a6 6 0 0 1 12 0v1h-2v7h1a3 3 0 0 0 3-3v-5a8 8 0 0 0-8-8Z",
    route: "M6 3a3 3 0 0 0-1 5.8V15a3 3 0 0 0 3 3h5.2A3 3 0 1 0 16 15.2 3 3 0 0 0 13.2 16H8a1 1 0 0 1-1-1V8.8A3 3 0 0 0 6 3Zm0 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm12 12a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z",
    star: "M12 2l3 6.3 6.9.9-5 4.8 1.2 6.8L12 17.8 5.9 20.8 7.1 14l-5-4.8 6.9-.9L12 2Z",
  };
  return (
    <svg viewBox="0 0 24 24" className={cls} fill="currentColor" aria-hidden>
      <path d={paths[name]} />
    </svg>
  );
}
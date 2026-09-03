export function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={"h-4 w-4 " + (i <= rating ? "text-orange-500" : "text-gray-300")}
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2l3 6.3 6.9.9-5 4.8 1.2 6.8L12 17.8 5.9 20.8 7.1 14l-5-4.8 6.9-.9L12 2Z" />
        </svg>
      ))}
    </div>
  );
}
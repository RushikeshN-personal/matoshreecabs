// Client: same-origin path (next.config rewrites proxy to the backend).
// Server (RSC): absolute backend URL — server-to-server has no CORS.
const API =
  typeof window === "undefined"
    ? `${process.env.BACKEND_ORIGIN ?? "http://localhost:4001"}/api`
    : "/api";

export interface ApiReview {
  id: string;
  rating: number;
  text: string | null;
  customer?: { name: string };
}

export async function fetchReviews(): Promise<ApiReview[]> {
  const res = await fetch(`${API}/reviews`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load reviews");
  return res.json();
}
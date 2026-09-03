const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001/api";

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
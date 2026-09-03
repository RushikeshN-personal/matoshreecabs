import { API_BASE } from "@/lib/constants/auth.constants";
import { getToken } from "@/lib/auth/auth-storage";

interface Options {
  method?: string;
  body?: unknown;
  auth?: boolean; // attach the bearer token
}

export async function apiFetch<T>(
  path: string,
  { method = "GET", body, auth = false }: Options = {},
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) || `Request failed (${res.status})`;
    throw new Error(Array.isArray(message) ? "Please check your input" : message);
  }
  return data as T;
}
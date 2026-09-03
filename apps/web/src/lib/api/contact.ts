import { apiFetch } from "./client";
import type { ContactInput } from "@matoshreecabs/shared";

export function submitContact(input: ContactInput) {
  return apiFetch<{ ok: boolean }>("/contact", {
    method: "POST",
    body: input,
  });
}
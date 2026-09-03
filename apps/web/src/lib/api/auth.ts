import { apiFetch } from "./client";
import type { AuthUser } from "@/lib/auth/auth-storage";

export interface AuthResult {
  accessToken: string;
  user: AuthUser;
}

export function loginWithPassword(email: string, password: string) {
  return apiFetch<AuthResult>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export interface RegisterInput {
  name: string;
  email: string;
  mobile: string;
  password?: string;
}

export function register(input: RegisterInput) {
  return apiFetch<{ id: string }>("/auth/register", {
    method: "POST",
    body: input,
  });
}

export function requestOtp(email: string) {
  return apiFetch<{ sent: boolean; devCode?: string }>("/auth/otp/request", {
    method: "POST",
    body: { email },
  });
}

export function verifyOtp(email: string, otp: string) {
  return apiFetch<AuthResult>("/auth/otp/verify", {
    method: "POST",
    body: { email, otp },
  });
}
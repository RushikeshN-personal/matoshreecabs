import { z } from 'zod';
import { MOBILE_REGEX } from '../constants';

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  mobile: z.string().regex(MOBILE_REGEX, 'Enter a valid 10-digit mobile'),
  password: z.string().min(8).max(72).optional(),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const requestOtpSchema = z.object({
  email: z.string().email(),
});
export type RequestOtpInput = z.infer<typeof requestOtpSchema>;

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export const passwordLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type PasswordLoginInput = z.infer<typeof passwordLoginSchema>;


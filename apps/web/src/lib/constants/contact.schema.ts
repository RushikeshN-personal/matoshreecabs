import { z } from "zod";
import { MOBILE_REGEX } from "@matoshreecabs/shared";

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(80),
  mobile: z.string().regex(MOBILE_REGEX, "Enter a valid 10-digit mobile"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  subject: z.string().min(1, "Choose a subject"),
  message: z.string().min(10, "Tell us a bit more (min 10 chars)").max(1000),
});

export type ContactInput = z.infer<typeof contactSchema>;
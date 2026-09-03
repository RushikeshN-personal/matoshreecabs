import { z } from 'zod';
import { MOBILE_REGEX } from '../constants';

export const contactSchema = z.object({
  name: z.string().min(2).max(80),
  mobile: z.string().regex(MOBILE_REGEX, 'Enter a valid 10-digit mobile'),
  email: z.string().email().optional().or(z.literal('')),
  subject: z.string().min(1).max(60),
  message: z.string().min(10).max(1000),
});
export type ContactInput = z.infer<typeof contactSchema>;
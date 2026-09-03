import { z } from 'zod';
import { MOBILE_REGEX } from '../constants';

// No password field — a random one is generated server-side and emailed to
// the driver, same as the driver-application approval flow.
export const driverCreateSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  mobile: z.string().regex(MOBILE_REGEX, 'Enter a valid 10-digit mobile'),
  location: z.string().max(60).optional(),
  licenceNo: z.string().min(3).max(40),
  languages: z.array(z.string()).default([]),
  experienceYrs: z.number().int().min(0).max(60).default(0),
  assignedCabId: z.string().optional(),
});
export type DriverCreateInput = z.infer<typeof driverCreateSchema>;

export const driverUpdateSchema = z.object({
  licenceNo: z.string().min(3).max(40).optional(),
  location: z.string().max(60).optional(),
  languages: z.array(z.string()).optional(),
  experienceYrs: z.number().int().min(0).max(60).optional(),
  availability: z.enum(['AVAILABLE', 'OFF_DUTY']).optional(),
  assignedCabId: z.string().nullable().optional(),
});
export type DriverUpdateInput = z.infer<typeof driverUpdateSchema>;

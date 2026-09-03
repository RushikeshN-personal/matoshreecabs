import { z } from 'zod';
import { MOBILE_REGEX } from '../constants';

// Public "apply to drive" form. Deliberately no Aadhaar/PAN/ID numbers here —
// those are collected during a verified in-person/phone follow-up, not over
// an open web form.
export const driverApplicationSchema = z.object({
  name: z.string().min(2).max(80),
  mobile: z.string().regex(MOBILE_REGEX, 'Enter a valid 10-digit mobile'),
  email: z.string().email().optional().or(z.literal('')),
  city: z.string().min(2).max(60),
  licenceNo: z.string().min(3).max(40),
  licenceExpiry: z.coerce.date().optional(),
  experienceYrs: z.number().int().min(0).max(60).default(0),
  ownsVehicle: z.boolean().default(false),
  vehicleType: z.string().max(40).optional().or(z.literal('')),
  vehicleNumber: z.string().max(20).optional().or(z.literal('')),
  preferredTrips: z.enum(['LOCAL', 'OUTSTATION', 'BOTH']).optional(),
  notes: z.string().max(500).optional().or(z.literal('')),
});
export type DriverApplicationInput = z.infer<typeof driverApplicationSchema>;

export const driverApplicationStatusSchema = z.object({
  status: z.enum(['NEW', 'REVIEWING', 'APPROVED', 'REJECTED']),
});
export type DriverApplicationStatusInput = z.infer<typeof driverApplicationStatusSchema>;

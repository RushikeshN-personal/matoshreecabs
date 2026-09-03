import { z } from 'zod';

const modeEnum = z.enum(['PICK_DROP', 'OUTSTATION', 'LOCAL', 'RENTAL']);

export const vehicleCreateSchema = z.object({
  name: z.string().min(1).max(60),
  description: z.string().max(1000).optional(),
  seating: z.number().int().min(1).max(50),
  luggage: z.number().int().min(0).max(50).default(0),
  ac: z.boolean().default(true),
  fuelType: z.string().min(1).max(30),
  features: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
});
export type VehicleCreateInput = z.infer<typeof vehicleCreateSchema>;

export const vehicleUpdateSchema = vehicleCreateSchema.partial();
export type VehicleUpdateInput = z.infer<typeof vehicleUpdateSchema>;

export const rateCardSchema = z.object({
  mode: modeEnum,
  packageKm: z.number().int().positive().default(300),
  baseRate: z.number().nonnegative(),
  extraKmRate: z.number().nonnegative().default(0),
  extraHrRate: z.number().nonnegative().default(0),
  driverAllowance: z.number().nonnegative().default(0),
  nightCharge: z.number().nonnegative().default(0),
});
export type RateCardInput = z.infer<typeof rateCardSchema>;
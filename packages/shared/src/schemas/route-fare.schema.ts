import { z } from 'zod';

const modeEnum = z.enum(['PICK_DROP', 'OUTSTATION', 'LOCAL']);

export const fareQuoteSchema = z.object({
  vehicleId: z.string().min(1),
  mode: modeEnum,
  fromCity: z.string().min(1),
  // Omitted (or absent) for a custom "Other" destination that isn't in our
  // stop list — that always resolves to "no fixed fare, contact WhatsApp".
  toCity: z.string().min(1).optional(),
});
export type FareQuoteInput = z.infer<typeof fareQuoteSchema>;

export const routeFareUpsertSchema = z.object({
  vehicleId: z.string().min(1),
  mode: modeEnum,
  fromCity: z.string().min(1).max(60),
  toCity: z.string().min(1).max(60),
  baseFare: z.number().nonnegative(),
  tollCharge: z.number().nonnegative().default(0),
  gstPercent: z.number().min(0).max(100).default(0),
  active: z.boolean().default(true),
});
export type RouteFareUpsertInput = z.infer<typeof routeFareUpsertSchema>;

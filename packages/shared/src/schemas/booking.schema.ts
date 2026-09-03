import { z } from 'zod';
import { MOBILE_REGEX } from '../constants/app.constants';
import { PICKUP_LOCATION_IDS, DEFAULT_PICKUP_LOCATION_ID } from '../constants/pickup-locations.constants';

// Rental is retired from the booking form (still a valid historical
// BookingMode value in the DB, just no longer offered for new bookings).
const modeEnum = z.enum(['PICK_DROP', 'OUTSTATION', 'LOCAL']);
const tripTypeEnum = z.enum(['ONE_WAY', 'ROUND_TRIP']);

// Login is not required to book. A logged-in customer is linked via their
// JWT server-side; everyone (guest or logged-in) supplies rider contact
// details here so the driver/ops can reach them.
export const bookingCreateSchema = z
  .object({
    mode: modeEnum,
    vehicleId: z.string().min(1),
    pickupLocationId: z.enum(PICKUP_LOCATION_IDS).default(DEFAULT_PICKUP_LOCATION_ID),
    destination: z.string().min(1).max(120).optional(),
    // The destination's parent city, used to look up a RouteFare — absent
    // for a free-typed "Other" destination, which always falls back to a
    // WhatsApp quote since there's no known route to price.
    destinationCity: z.string().min(1).max(60).optional(),
    tripType: tripTypeEnum.optional(),
    dateTime: z.coerce.date(),
    returnDateTime: z.coerce.date().optional(),
    passengers: z.number().int().min(1).max(50).default(1),
    riderName: z.string().min(2).max(60),
    riderMobile: z.string().regex(MOBILE_REGEX, 'Enter a valid 10-digit mobile number'),
    riderEmail: z.string().email().optional().or(z.literal('')),
    // None of these are required to book.
    gstNumber: z.string().max(20).optional().or(z.literal('')),
    flightNumber: z.string().max(20).optional().or(z.literal('')),
    trainNumber: z.string().max(20).optional().or(z.literal('')),
  })
  .refine((data) => !!data.destination, {
    message: 'Destination is required',
    path: ['destination'],
  })
  .refine(
    (data) => data.mode !== 'OUTSTATION' ? true : !!data.tripType,
    { message: 'Trip type is required for outstation trips', path: ['tripType'] },
  )
  .refine(
    (data) => data.tripType !== 'ROUND_TRIP' ? true : !!data.returnDateTime,
    { message: 'Return date/time is required for round trips', path: ['returnDateTime'] },
  )
  .refine(
    (data) => !data.returnDateTime || data.returnDateTime >= data.dateTime,
    { message: 'Return date/time must be on or after the start', path: ['returnDateTime'] },
  )
  .refine((data) => data.dateTime > new Date(), {
    message: 'Pickup date/time must be in the future',
    path: ['dateTime'],
  });
export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;

export const bookingCancelSchema = z.object({
  reason: z.string().max(300).optional(),
});
export type BookingCancelInput = z.infer<typeof bookingCancelSchema>;

export const bookingAssignDriverSchema = z.object({
  driverId: z.string().min(1),
});
export type BookingAssignDriverInput = z.infer<typeof bookingAssignDriverSchema>;

export const tripCancelSchema = z.object({
  reason: z.string().min(1).max(300),
});
export type TripCancelInput = z.infer<typeof tripCancelSchema>;

export const bookingTrackSchema = z.object({
  ref: z.string().min(1),
  mobile: z.string().regex(MOBILE_REGEX, 'Enter a valid 10-digit mobile number'),
});
export type BookingTrackInput = z.infer<typeof bookingTrackSchema>;

export const recordPaymentSchema = z.object({
  amount: z.number().positive(),
  method: z.enum(['CASH', 'UPI']).default('CASH'),
});
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;

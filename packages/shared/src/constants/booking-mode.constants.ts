export const BOOKING_MODES = {
  PICK_DROP: 'PICK_DROP',
  OUTSTATION: 'OUTSTATION',
  LOCAL: 'LOCAL',
  RENTAL: 'RENTAL',
} as const;

export const BOOKING_MODE_LABELS: Record<string, string> = {
  PICK_DROP: 'Pick & Drop',
  OUTSTATION: 'Outstation',
  LOCAL: 'Daily / Local',
  RENTAL: 'Rental',
};


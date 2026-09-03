// GST applied only if Matoshree Cabs is GST-registered (configurable; 0 = off)
export const DEFAULT_GST_RATE = 0;

export const FARE_COMPONENTS = {
  BASE: 'base',
  EXTRAS: 'extras',
  OUTSTATION_ADDS: 'outstationAdds',
  PASS_THROUGH: 'passThrough',
  DISCOUNT: 'discount',
  GST: 'gst',
} as const;

export const CURRENCY = 'INR';

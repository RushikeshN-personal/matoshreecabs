export const APP_NAME = 'Matoshree Cabs';
export const PICKUP_CITY = 'Pune';
export const DEFAULT_COUNTRY_CODE = '+91';

export const OTP_LENGTH = 6;
export const OTP_TTL_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;

export const JWT_DEFAULT_EXPIRES_IN = '1d';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// 10-digit Indian mobile number
export const MOBILE_REGEX = /^[6-9]\d{9}$/;


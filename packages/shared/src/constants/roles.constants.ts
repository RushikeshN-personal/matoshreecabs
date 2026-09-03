export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  DRIVER: 'DRIVER',
  ADMIN: 'ADMIN',
  DEVELOPER: 'DEVELOPER',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: 'Customer',
  DRIVER: 'Driver',
  ADMIN: 'Admin',
  DEVELOPER: 'Developer',
};

export const STAFF_ROLES = [ROLES.ADMIN, ROLES.DEVELOPER] as const;


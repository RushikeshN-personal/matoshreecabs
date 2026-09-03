// No advance/QR payment — the customer pays the driver directly (cash or
// UPI to the driver's own number/QR) once the trip is completed. `Payment`
// is just a record of what was collected, for reporting/reconciliation.
export const PAYMENT_METHODS = {
  CASH: 'CASH',
  UPI: 'UPI',
} as const;

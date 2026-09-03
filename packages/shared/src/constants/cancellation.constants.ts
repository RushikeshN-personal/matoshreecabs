// No advance is collected, so cancellation has no refund math — cancelling
// just changes booking status. These thresholds only classify a cancellation
// as "on time" vs "late" for reporting/driver-reliability purposes.
export const CANCELLATION_NOTICE_HOURS = {
  OUTSTATION: 6,
  DEFAULT: 1,
} as const;

export function generateBookingRef(): string {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  const stamp = Date.now().toString(36).toUpperCase();
  return `AC-${stamp}-${rand}`;
}

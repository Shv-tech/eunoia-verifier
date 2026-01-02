export function enforceRetention<T extends { timestamp: number }>(
  records: T[],
  maxAgeMs: number
): T[] {
  const cutoff = Date.now() - maxAgeMs;
  return records.filter(r => r.timestamp >= cutoff);
}

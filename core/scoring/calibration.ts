export function calibrateScore(
  trustScore: number,
  overconfidenceSignals: string[]
): number {
  const penalty = overconfidenceSignals.length * 5;
  return Math.max(0, trustScore - penalty);
}

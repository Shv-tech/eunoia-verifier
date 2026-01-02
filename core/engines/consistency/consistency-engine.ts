export function computeConsistencyScore(
  contradictions: string[],
  inferenceGaps: string[]
): number {
  const penalty =
    contradictions.length * 30 + inferenceGaps.length * 15;

  return Math.max(0, 100 - penalty);
}

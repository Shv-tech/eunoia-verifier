export function regressionTest(
  scores: number[]
): boolean {
  return scores.every(s => s >= 60);
}

export function requiresApproval(
  score: number
): boolean {
  return score < 70;
}

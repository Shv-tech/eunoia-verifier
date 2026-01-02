export function explainScore(
  score: number
): "Reliable" | "Conditional" | "High Risk" {
  if (score >= 80) return "Reliable";
  if (score >= 50) return "Conditional";
  return "High Risk";
}

export function buildExecutiveBrief(
  score: number,
  risks: string[]
): string {
  return `
Decision Readiness: ${score >= 70 ? "Proceed" : "Caution"}
Key Risks:
${risks.join("\n")}
`;
}

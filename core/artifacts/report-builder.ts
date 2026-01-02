export function buildReport(
  content: string,
  findings: string[]
): string {
  return `
--- REPORT ---
${content}

FINDINGS:
${findings.join("\n")}
`;
}

export function mapCompliance(
  domain: string
): string[] {
  if (domain === "legal") return ["GDPR", "HIPAA"];
  return [];
}

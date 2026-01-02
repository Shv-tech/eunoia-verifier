export function runRedTeamTests(
  text: string
): boolean {
  return !text.toLowerCase().includes("ignore safeguards");
}

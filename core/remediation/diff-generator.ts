export function generateDiff(
  original: string,
  revised: string
): string {
  return `- ${original}\n+ ${revised}`;
}

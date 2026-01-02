export function normalizeInput(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function detectPromptInjection(text: string): boolean {
  const patterns = [
    "ignore previous instructions",
    "system override",
    "act as",
  ];

  return patterns.some(p => text.toLowerCase().includes(p));
}

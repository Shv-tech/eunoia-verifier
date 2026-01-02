export function detectDataLeak(text: string): boolean {
  return (
    text.includes("API_KEY") ||
    text.includes("password") ||
    text.includes("secret")
  );
}

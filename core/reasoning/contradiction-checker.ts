import { Claim } from "../claims/claim-decomposer";

export function detectContradictions(claims: Claim[]): string[] {
  const contradictions: string[] = [];

  const texts = claims.map(c => c.text.toLowerCase());

  if (
    texts.some(t => t.includes("will happen")) &&
    texts.some(t => t.includes("will not happen"))
  ) {
    contradictions.push("Direct future-state contradiction detected");
  }

  return contradictions;
}

import { Claim } from "../../claims/claim-decomposer";

export function extractAssumptions(claims: Claim[]): string[] {
  const assumptions: string[] = [];

  claims.forEach(c => {
    if (c.text.includes("assumes")) {
      assumptions.push(c.text);
    }
  });

  return assumptions;
}

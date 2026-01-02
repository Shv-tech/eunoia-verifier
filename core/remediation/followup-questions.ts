import { Claim } from "../claims/claim-decomposer";

export function generateFollowUps(
  claims: Claim[]
): string[] {
  return claims.map(
    c => `What evidence supports claim ${c.id}?`
  );
}

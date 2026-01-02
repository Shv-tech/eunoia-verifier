import { Claim } from "../claims/claim-decomposer";

export function rewriteClaim(
  claim: Claim
): string {
  return `⚠ Revised: ${claim.text} (add evidence or reduce certainty)`;
}

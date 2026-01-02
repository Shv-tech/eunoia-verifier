import { Claim } from "../../claims/claim-decomposer";
import { Tone } from "../../intake/tone-calibration";

export function detectOverconfidence(
  claims: Claim[],
  tone: Tone
): string[] {
  if (tone !== "assertive") return [];

  return claims
    .filter(c => c.type === "predictive" || c.type === "numerical")
    .map(c => `Overconfident phrasing in ${c.id}`);
}

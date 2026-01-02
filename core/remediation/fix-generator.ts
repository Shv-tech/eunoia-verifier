import { Claim } from "../claims/claim-decomposer";
import { rewriteClaim } from "./claim-rewriter";

export function generateFixPack(
  riskyClaims: Claim[]
): string[] {
  return riskyClaims.map(rewriteClaim);
}

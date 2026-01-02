import { Claim } from "./claim-decomposer";
import { ClaimType } from "./claim-types";

export type ClaimRisk = "low" | "medium" | "high";

export function assessClaimRisk(claim: Claim): ClaimRisk {
  if (claim.type === "numerical" || claim.type === "predictive") {
    return "high";
  }
  if (claim.type === "causal") {
    return "medium";
  }
  return "low";
}

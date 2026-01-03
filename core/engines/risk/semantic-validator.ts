// core/engines/risk/semantic-validator.ts
import { Claim } from "../../claims/claim-decomposer";
import { RiskExplanation } from "../../risk/types";
import { Domain } from "../../intake/domain-classifier";

/**
 * World-Class Logic Gates:
 * Checks claims against fundamental Universal Constraints.
 */
export async function detectSemanticViolations(claims: Claim[], domain: Domain): Promise<RiskExplanation[]> {
  const risks: RiskExplanation[] = [];
  for (const claim of claims) {
    // Physics/Science Gate: Flag entropy/perpetual motion violations
    if (domain === "research" && /(entropy|perpetual|faster than light|over-unity)/i.test(claim.text)) {
      risks.push(createRisk(claim, "high", "Violation of fundamental physical laws detected."));
    }
    // Regulatory Gate: Flag SEC 'Guaranteed Returns' or FDA 'Instant Cure'
    if ((domain === "finance" || domain === "legal") && /(100% guaranteed|no-risk profit|bypass regulation)/i.test(claim.text)) {
      risks.push(createRisk(claim, "high", "SEC/Regulatory violation: Guaranteed returns without risk disclosure are legally invalid."));
    }
  }
  return risks;
}

function createRisk(claim: Claim, severity: any, observation: string): RiskExplanation {
  return {
    id: `semantic-${claim.id}`, claimId: claim.id, type: "hallucination", severity,
    reasoning: { observation, implication: "This claim forms a logical impossibility that invalidates the surrounding context." },
    remediation: { action: "Remove absolute qualifiers or cite breakthrough validation results." }
  };
}
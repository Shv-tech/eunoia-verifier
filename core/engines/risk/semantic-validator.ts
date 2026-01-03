// core/engines/risk/semantic-validator.ts
import { Claim } from "../../claims/claim-decomposer";
import { RiskExplanation } from "../../risk/types";
import { Domain } from "../../intake/domain-classifier";

export async function detectSemanticViolations(
  claims: Claim[],
  domain: Domain
): Promise<RiskExplanation[]> {
  const risks: RiskExplanation[] = [];

  for (const claim of claims) {
    // 1. Absolutism Gate
    if (/(100%|guaranteed|impossible to fail|infallible|perfect)/i.test(claim.text)) {
      risks.push(createRisk(claim, "high", "Absolutist phrasing detected. In professional auditing, absolute certainty is a primary red flag for fraud."));
    }

    // 2. Physical/Scientific Law Gate (Entropy/Thermodynamics)
    if (domain === "research" && /(entropy|perpetual|over-unity|faster than light)/i.test(claim.text)) {
      risks.push(createRisk(claim, "high", "Violation of fundamental scientific constants. This claim contradicts established physical laws."));
    }

    // 3. Regulatory Gate (Finance/Legal)
    if ((domain === "finance" || domain === "legal") && /(guaranteed returns|no-risk profit|bypass regulation)/i.test(claim.text)) {
      risks.push(createRisk(claim, "high", "Regulatory compliance violation. Promised returns without risk disclosure are prohibited by financial authorities."));
    }
  }

  return risks;
}

function createRisk(claim: Claim, severity: any, observation: string): RiskExplanation {
  return {
    id: `semantic-${claim.id}`,
    claimId: claim.id,
    type: "hallucination",
    severity,
    reasoning: {
      observation,
      implication: "The entire logical structure of the document is compromised by this impossible premise.",
    },
    remediation: {
      action: "Remove absolute qualifiers or provide proof of breakthrough validation.",
    }
  };
}
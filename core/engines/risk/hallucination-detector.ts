import { RiskExplanation } from "../../risk/types";
import { Claim } from "../../claims/claim-decomposer";

type EvidenceMatch = {
  claimId: string;
  sources: string[];
};

export function detectHallucinations(
  claims: Claim[],
  evidenceMatches: EvidenceMatch[]
): RiskExplanation[] {

  const evidenceByClaim = new Map(
    evidenceMatches.map(e => [e.claimId, e.sources])
  );

  return claims
    .filter(claim => {
      const sources = evidenceByClaim.get(claim.id);
      return !sources || sources.length === 0;
    })
    .map(claim => ({
      id: `hallucination-${claim.id}`,
      claimId: claim.id,
      type: "hallucination",
      severity: "medium",
      reasoning: {
        observation:
          "The claim makes an assertion without referencing supporting evidence.",
        missing: [
          "external benchmarks",
          "independent validation",
          "verifiable data sources",
        ],
        implication:
          "This increases the risk that readers may treat speculative statements as factual.",
      },
      remediation: {
        action:
          "Explicitly state uncertainty or provide supporting external references.",
        example:
          "Internal testing suggests improvements, though no independent benchmarks are available yet.",
      },
    }));
}

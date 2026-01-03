// core/engines/risk/refutation-engine.ts
import { Claim } from "../../claims/claim-decomposer";
import { LLMProvider } from "../../../lib/llm/provider-adapter";
import { RiskExplanation } from "../../risk/types";

export async function runAdversarialRefutation(
  claims: Claim[],
  provider: LLMProvider
): Promise<RiskExplanation[]> {
  const risks: RiskExplanation[] = [];

  // Parallel refutation for speed
  await Promise.all(claims.map(async (claim) => {
    const prompt = `
      Act as a Skeptical Auditor. Your goal is to DEBUNK this claim.
      Identify the specific logical fallacy, missing assumption, or data gap that makes this claim unreliable.
      
      Claim: "${claim.text}"
      
      If you find a structural weakness, return a JSON object with "reason" and "implication". 
      Otherwise return null.
    `;

    const response = await provider.generate({ prompt, temperature: 0.2 });
    try {
      const defect = JSON.parse(response.text);
      if (defect) {
        risks.push({
          id: `refute-${claim.id}`,
          claimId: claim.id,
          type: "consistency",
          severity: "medium",
          reasoning: {
            observation: defect.reason,
            implication: defect.implication,
          },
          remediation: { action: "Address the specific logical counter-argument." }
        });
      }
    } catch (e) { /* No defect found */ }
  }));

  return risks;
}
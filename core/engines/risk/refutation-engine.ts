// core/engines/risk/refutation-engine.ts
import { Claim } from "../../claims/claim-decomposer";
import { LLMProvider } from "../../../lib/llm/provider-adapter";
import { RiskExplanation } from "../../risk/types";

/**
 * The 'Red-Team' Refutation Engine:
 * Actively attempts to prove a claim is FALSE.
 */
export async function runAdversarialRefutation(claims: Claim[], provider: LLMProvider): Promise<RiskExplanation[]> {
  const risks: RiskExplanation[] = [];
  await Promise.all(claims.map(async (claim) => {
    const prompt = `Act as a Skeptical Auditor. DEBUNK this claim: "${claim.text}". 
    Look for hidden assumptions or data gaps. Return JSON {"reason": string, "implication": string} or "null".`;
    
    const response = await provider.generate({ prompt, temperature: 0.1 });
    const text = response.text.replace(/```json|```/g, "").trim();
    if (text !== "null") {
      try {
        const defect = JSON.parse(text);
        risks.push({
          id: `refute-${claim.id}`, claimId: claim.id, type: "consistency", severity: "medium",
          reasoning: { observation: defect.reason, implication: defect.implication },
          remediation: { action: "Provide specific substantiation for this logical gap." }
        });
      } catch (e) {}
    }
  }));
  return risks;
}
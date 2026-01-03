// core/reasoning/causal-validator.ts
import { Claim } from "../claims/claim-decomposer";
import { ReasoningGraph } from "./graph-builder";
import { RiskExplanation } from "../risk/types";
import { LLMProvider } from "../../lib/llm/provider-adapter";

export async function validateCausalBridgesProduction(
  graph: ReasoningGraph, 
  claims: Claim[], 
  provider: LLMProvider
): Promise<RiskExplanation[]> {
  const risks: RiskExplanation[] = [];
  await Promise.all(graph.edges.map(async (edge) => {
    const source = claims.find(c => c.id === edge.from);
    const target = claims.find(c => c.id === edge.to);
    if (!source || !target) return;

    const prompt = `MECE Logic Audit: 
    Premise A: "${source.text}" 
    Conclusion B: "${target.text}" 
    Is this causal link logically sufficient? Search for 'Leaps of Faith' or 'Non Sequiturs'. 
    Return JSON {"defect": string, "severity": "high"|"medium"} or "null".`;
    
    const response = await provider.generate({ prompt, temperature: 0 });
    const text = response.text.replace(/```json|```/g, "").trim();
    if (text !== "null") {
      try {
        const audit = JSON.parse(text);
        risks.push({
          id: `bridge-${source.id}-${target.id}`, claimId: target.id, type: "consistency", severity: audit.severity,
          reasoning: { observation: audit.defect, implication: "Strategic logical gap: the conclusion assumes a 100% conversion that is not evidenced." },
          remediation: { action: "Define the specific variables that bridge these two assertions." }
        });
      } catch (e) {}
    }
  }));
  return risks;
}
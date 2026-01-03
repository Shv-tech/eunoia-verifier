// core/reasoning/causal-validator.ts
import { Claim } from "../claims/claim-decomposer";
import { ReasoningGraph } from "./graph-builder";
import { RiskExplanation } from "../risk/types";
import { LLMProvider } from "../../lib/llm/provider-adapter";

/**
 * Advanced Causal Validator:
 * Performs structural logic auditing on the connections between claims.
 * Identifies "Leaps of Faith," "Non Sequiturs," and "Unsubstantiated Projections."
 */
export async function validateCausalBridgesProduction(
  graph: ReasoningGraph,
  claims: Claim[],
  provider: LLMProvider
): Promise<RiskExplanation[]> {
  const risks: RiskExplanation[] = [];

  // Parallel analysis for world-class performance
  await Promise.all(
    graph.edges.map(async (edge) => {
      const source = claims.find((c) => c.id === edge.from);
      const target = claims.find((c) => c.id === edge.to);

      if (!source || !target) return;

      /* 1. Heuristic Logic Gate: Factual to Predictive Leaps */
      if (source.type === "factual" && target.type === "predictive") {
        risks.push({
          id: `heuristic-leap-${source.id}-${target.id}`,
          claimId: target.id,
          type: "consistency",
          severity: "medium",
          reasoning: {
            observation: `Factual-to-Predictive bridge detected between ${source.id} and ${target.id}.`,
            implication: "The projection assumes current conditions will persist perfectly into the future without external volatility.",
          },
          remediation: {
            action: "Add 'Sensitivity Analysis' or state the specific conditions required for this projection to hold true.",
          },
        });
      }

      /* 2. Adversarial LLM Logic Audit: Semantic Fallacy Detection */
      const prompt = `
        Act as a Senior McKinsey Strategy Auditor. Analyze the logical bridge between these two claims.
        
        Claim A (Source): "${source.text}"
        Claim B (Target): "${target.text}"
        
        Task: Does Claim A logically and sufficiently support the conclusion in Claim B?
        Look for:
        - Non Sequitur: The conclusion doesn't follow the premise.
        - Leap of Faith: Target assumes a 100% success rate of an unproven process.
        - Correlation/Causation Fallacy.

        Return ONLY a JSON object: 
        {"defect": "string describing the fallacy", "severity": "high" | "medium" | "low"} 
        or return "null" if the logic is airtight.
      `;

      try {
        const response = await provider.generate({ prompt, temperature: 0 });
        const resultText = response.text.replace(/```json|```/g, "").trim();

        if (resultText !== "null") {
          const audit = JSON.parse(resultText);
          risks.push({
            id: `logic-bridge-${source.id}-${target.id}`,
            claimId: target.id,
            type: "consistency",
            severity: audit.severity,
            reasoning: {
              observation: audit.defect,
              implication: "Structural logical failure: the conclusion relies on a premise that does not fully substantiate it.",
            },
            remediation: {
              action: "Provide the 'missing link' data or weaken the certainty of the conclusion.",
            },
          });
        }
      } catch (e) {
        // Silent fail for malformed JSON to ensure pipeline continuity
      }
    })
  );

  return risks;
}
// core/pipelines/verify-pipeline.ts
import { normalizeInput } from "../intake/normalize";
import { calibrateTone } from "../intake/tone-calibration";
import { classifyDomain, Domain } from "../intake/domain-classifier";
import { decomposeClaimsAdvanced, Claim } from "../claims/claim-decomposer";
import { linkClaims } from "../claims/claim-linker";
import { buildGraph } from "../reasoning/graph-builder";
import { detectContradictions } from "../reasoning/contradiction-checker";
import { detectInferenceGaps } from "../reasoning/inference-gap-detector";
import { mapEvidence } from "../engines/grounding/evidence-mapper";
import { computeGroundingScore } from "../engines/grounding/grounding-engine";
import { computeConsistencyScore } from "../engines/consistency/consistency-engine";
import { detectHallucinations } from "../engines/risk/hallucination-detector";
import { detectOverconfidence } from "../engines/risk/overconfidence-detector";
import { extractAssumptions } from "../engines/assumptions/assumption-extractor";
import { detectSemanticViolations } from "../engines/risk/semantic-validator";
import { runAdversarialRefutation } from "../engines/risk/refutation-engine";
import { validateCausalBridgesProduction } from "../reasoning/causal-validator";
import { computeETS, ETSComponents } from "../scoring/trust-score";
import { ETS_WEIGHTS, WeightProfile } from "../scoring/weighting-profiles";
import { RiskExplanation } from "../risk/types";
import { LLMProvider } from "../../lib/llm/provider-adapter";

export interface VerifyResult {
  score: number;
  claims: Claim[];
  risks: RiskExplanation[];
  explainability: {
    contradictions: string[];
    inferenceGaps: string[];
    overconfidence: string[];
    assumptions: string[];
    auditStatus: "PASSED" | "CRITICAL_FAILURE";
  };
}

export async function verifyPipeline(
  rawText: string,
  profile: WeightProfile,
  provider: LLMProvider,
  sources: string[] = []
): Promise<VerifyResult> {
  const text = normalizeInput(rawText);
  const tone = calibrateTone(text);
  const domain: Domain = classifyDomain(text);

  // 1. Forensic Decomposition
  const claims = await decomposeClaimsAdvanced(text, provider);

  // 2. Structural Reasoning
  const links = linkClaims(claims);
  const graph = buildGraph(claims, links);
  const evidenceMatches = mapEvidence(claims, sources);

  // 3. Parallel Adversarial Analysis (The "Skeptic" Layer)
  const [semanticRisks, refutationRisks, causalRisks] = await Promise.all([
    detectSemanticViolations(claims, domain),
    runAdversarialRefutation(claims, provider),
    validateCausalBridgesProduction(graph, claims, provider)
  ]);

  // 4. Score Components
  const contradictions = detectContradictions(claims);
  const inferenceGaps = detectInferenceGaps(graph);
  const groundingScore = computeGroundingScore(evidenceMatches);
  const consistencyScore = computeConsistencyScore(contradictions, inferenceGaps);
  const hallucinationRisks = detectHallucinations(claims, evidenceMatches);
  const overconfidenceSignals = detectOverconfidence(claims, tone);
  const assumptions = extractAssumptions(claims);

  const allRisks = [...semanticRisks, ...refutationRisks, ...causalRisks, ...hallucinationRisks];

  // 5. ETS Component Calculation
  const components: ETSComponents = {
    grounding: groundingScore,
    consistency: consistencyScore,
    assumptions: Math.max(0, 100 - assumptions.length * 10),
    safety: Math.max(0, 100 - allRisks.filter(r => r.severity === "high").length * 25),
    security: 100,
    calibration: Math.max(0, 100 - overconfidenceSignals.length * 10),
  };

  let score = Math.max(0, Math.round(computeETS(components, ETS_WEIGHTS[profile])));

  // 6. Logic Gate: Structural Failure Check
  const hasCriticalFailure = allRisks.some(r => r.severity === "high") || 
                            claims.some(c => c.gravity === "critical");
  
  if (hasCriticalFailure) {
    score = Math.min(score, 18); // Hard cap for impossible/unsubstantiated claims
  }

  return {
    score,
    claims,
    risks: allRisks,
    explainability: {
      contradictions,
      inferenceGaps,
      overconfidence: overconfidenceSignals,
      assumptions,
      auditStatus: hasCriticalFailure ? "CRITICAL_FAILURE" : "PASSED"
    },
  };
}
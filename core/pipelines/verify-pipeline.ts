// core/pipelines/verify-pipeline.ts

import { normalizeInput } from "../intake/normalize";
import { calibrateTone } from "../intake/tone-calibration";
import { classifyDomain, Domain } from "../intake/domain-classifier";

import { decomposeClaimsAdvanced, Claim } from "../claims/claim-decomposer";
import { performWebSearch } from "../../lib/tools/google-search";
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

/**
 * World-Class Audit Result Structure
 */
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

const DEFAULT_PROFILE: WeightProfile = "founder";

/**
 * The Adversarial Verification Pipeline:
 * Performs structural, semantic, and causal auditing against live reality anchors.
 */
export async function verifyPipeline(
  rawText: string,
  profile: WeightProfile = DEFAULT_PROFILE,
  provider: LLMProvider, // Required for World-Class Semantic Auditing
  sources: string[] = []
): Promise<VerifyResult> {
  // 1. Intake & Forensic Signal Processing
  const text = normalizeInput(rawText);
  const tone = calibrateTone(text);
  const domain: Domain = classifyDomain(text);

  // 2. Forensic Claim Decomposition (Adversarial LLM-driven)
  // Replaces heuristic extraction with Audit Gravity assessment
  const claims = await decomposeClaimsAdvanced(text, provider);

  // 3. Structural Reasoning & Live Grounding (Parallel)
  const [links, liveEvidence] = await Promise.all([
    Promise.resolve(linkClaims(claims)),
    Promise.all(
      claims
        .filter((c) => c.gravity === "critical" || c.gravity === "high")
        .slice(0, 3) // Real-world grounding for high-stakes claims
        .map(async (claim) => {
          const results = await performWebSearch(claim.text);
          return { claimId: claim.id, results };
        })
    ),
  ]);

  const graph = buildGraph(claims, links);
  const liveLinks = liveEvidence.flatMap((le) => le.results.map((r) => r.link));
  const allSources = [...sources, ...liveLinks];

  // 4. Multi-Stage Adversarial Auditing (Parallel)
  // Simultaneous check for: Semantic Laws, Red-Team Refutations, and Causal Sufficiency
  const [semanticRisks, refutationRisks, causalRisks] = await Promise.all([
    detectSemanticViolations(claims, domain),
    runAdversarialRefutation(claims, provider),
    validateCausalBridgesProduction(graph, claims, provider),
  ]);

  // 5. Heuristic Defect Processing
  const contradictions = detectContradictions(claims);
  const inferenceGaps = detectInferenceGaps(graph);
  const evidenceMatches = mapEvidence(claims, allSources);
  const hallucinationRisks = detectHallucinations(claims, evidenceMatches);
  const overconfidenceSignals = detectOverconfidence(claims, tone);
  const assumptions = extractAssumptions(claims);

  // 6. Global Risk Aggregation
  const allRisks = [
    ...semanticRisks,
    ...refutationRisks,
    ...causalRisks,
    ...hallucinationRisks,
  ];

  // 7. Whitepaper-Aligned Scoring Logic
  const groundingScore = computeGroundingScore(evidenceMatches);
  const consistencyScore = computeConsistencyScore(contradictions, inferenceGaps);

  const components: ETSComponents = {
    grounding: groundingScore,
    consistency: consistencyScore,
    assumptions: Math.max(0, 100 - assumptions.length * 10),
    safety: Math.max(0, 100 - allRisks.filter((r) => r.severity === "high").length * 25),
    security: 100, // Security layer placeholder
    calibration: Math.max(0, 100 - overconfidenceSignals.length * 10),
  };

  let score = Math.max(0, Math.round(computeETS(components, ETS_WEIGHTS[profile])));

  // 8. LOGIC GATE: High-Gravity Override
  // If a claim violates physical/legal laws or red-team debunking found high severity issues, 
  // cap the score at 18/100 regardless of citations.
  const hasCriticalFailure =
    allRisks.some((r) => r.severity === "high") ||
    claims.some((c) => c.gravity === "critical");

  if (hasCriticalFailure) {
    score = Math.min(score, 18);
  }

  // 9. Enterprise Audit Return Package
  return {
    score,
    claims,
    risks: allRisks,
    explainability: {
      contradictions,
      inferenceGaps,
      overconfidence: overconfidenceSignals,
      assumptions,
      auditStatus: hasCriticalFailure ? "CRITICAL_FAILURE" : "PASSED",
    },
  };
}
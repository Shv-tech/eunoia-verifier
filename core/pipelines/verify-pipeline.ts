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

  // 2. Parallel Structural Analysis & Live Grounding
  const [links, liveEvidence] = await Promise.all([
    Promise.resolve(linkClaims(claims)),
    Promise.all(
      claims
        .filter((c) => c.gravity === "critical" || c.gravity === "high")
        .slice(0, 3)
        .map(async (claim) => {
          const results = await performWebSearch(claim.text);
          return { claimId: claim.id, results: results || [] };
        })
    ),
  ]);

  const graph = buildGraph(claims, links);
  const liveLinks = liveEvidence.flatMap((le) => le.results.map((r) => r.link));
  const allSources = [...sources, ...liveLinks];

  // 3. Parallel Adversarial Logic Audits
  const [semanticRisks, refutationRisks, causalRisks] = await Promise.all([
    detectSemanticViolations(claims, domain),
    runAdversarialRefutation(claims, provider),
    validateCausalBridgesProduction(graph, claims, provider),
  ]);

  // 4. Heuristic Defect Processing
  const contradictions = detectContradictions(claims);
  const inferenceGaps = detectInferenceGaps(graph);
  const evidenceMatches = mapEvidence(claims, allSources);
  const hallucinationRisks = detectHallucinations(claims, evidenceMatches);
  const overconfidenceSignals = detectOverconfidence(claims, tone);
  const assumptions = extractAssumptions(claims);

  const allRisks = [...semanticRisks, ...refutationRisks, ...causalRisks, ...hallucinationRisks];

  // 5. Final ETS Scoring with Audit Gate
  const components: ETSComponents = {
    grounding: computeGroundingScore(evidenceMatches),
    consistency: computeConsistencyScore(contradictions, inferenceGaps),
    assumptions: Math.max(0, 100 - assumptions.length * 10),
    safety: Math.max(0, 100 - allRisks.filter((r) => r.severity === "high").length * 25),
    security: 100,
    calibration: Math.max(0, 100 - overconfidenceSignals.length * 10),
  };

  let score = Math.max(0, Math.round(computeETS(components, ETS_WEIGHTS[profile])));

  // Logic Gate: If critical violations exist, force audit failure status
  const hasCriticalFailure = allRisks.some((r) => r.severity === "high") || claims.some((c) => c.gravity === "critical");
  if (hasCriticalFailure) score = Math.min(score, 18);

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
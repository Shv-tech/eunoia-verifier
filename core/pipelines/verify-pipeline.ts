import { normalizeInput } from "../intake/normalize";
import { calibrateTone } from "../intake/tone-calibration";
import { classifyDomain, Domain } from "../intake/domain-classifier";

import { decomposeClaims, Claim } from "../claims/claim-decomposer";
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

import {
  computeETS,
  ETSComponents,
} from "../scoring/trust-score";

import {
  ETS_WEIGHTS,
  WeightProfile,
} from "../scoring/weighting-profiles";

import { RiskExplanation } from "../risk/types";

/* -------------------------------
   Types
-------------------------------- */

export interface VerifyResult {
  score: number;
  claims: Claim[];
  risks: RiskExplanation[];
  explainability: {
    contradictions: string[];
    inferenceGaps: string[];
    overconfidence: string[];
    assumptions: string[];
  };
}

/* -------------------------------
   Main Pipeline (DETERMINISTIC)
-------------------------------- */

export function verifyPipeline(
  rawText: string,
  profile: WeightProfile,
  sources: string[] = []
): VerifyResult {

  /* 1. Normalize */
  const text = normalizeInput(rawText);

  /* 2. Intake signals */
  const tone = calibrateTone(text);
  const domain: Domain = classifyDomain(text);

  /* 3. Claim decomposition (FORCE STABLE IDS) */
  const rawClaims = decomposeClaims(text);

  const claims: Claim[] = rawClaims.map((c, index) => ({
    ...c,
    id: `C${index + 1}`, // 🔒 deterministic, repeatable, audit-safe
  }));

  /* 4. Reasoning structure */
  const links = linkClaims(claims);
  const graph = buildGraph(claims, links);

  /* 5. Reasoning defects */
  const contradictions = detectContradictions(claims);
  const inferenceGaps = detectInferenceGaps(graph);

  /* 6. Grounding */
  const evidenceMatches = mapEvidence(claims, sources);
  const groundingScore = computeGroundingScore(evidenceMatches);

  /* 7. Consistency */
  const consistencyScore = computeConsistencyScore(
    contradictions,
    inferenceGaps
  );

  /* 8. Risk Engines (STRUCTURED) */
  const hallucinationRisks: RiskExplanation[] =
    detectHallucinations(claims, evidenceMatches);

  const overconfidenceSignals =
    detectOverconfidence(claims, tone);

  const assumptions =
    extractAssumptions(claims);

  /* 9. ETS components (WHITEPAPER-ALIGNED) */
  const components: ETSComponents = {
    grounding: groundingScore,
    consistency: consistencyScore,
    assumptions: Math.max(
      0,
      100 - assumptions.length * 10
    ),
    safety: Math.max(
      0,
      100 - hallucinationRisks.length * 20
    ),
    security: 100, // future security aggregation
    calibration: Math.max(
      0,
      100 - overconfidenceSignals.length * 10
    ),
  };

  /* 10. Final Trust Score */
  const score = Math.max(
    0,
    Math.round(
      computeETS(
        components,
        ETS_WEIGHTS[profile]
      )
    )
  );

  /* 11. Return ENTERPRISE-GRADE OUTPUT */
  return {
    score,
    claims,
    risks: hallucinationRisks,
    explainability: {
      contradictions,
      inferenceGaps,
      overconfidence: overconfidenceSignals,
      assumptions,
    },
  };
}

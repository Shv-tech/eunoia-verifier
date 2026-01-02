// core/engines/grounding/grounding-engine.ts
import { EvidenceMatch } from "./evidence-mapper"; 

export function computeGroundingScore(
  matches: EvidenceMatch[]
): number {
  if (matches.length === 0) return 0;

  const supported = matches.filter(m => m.supported).length;
  // Basic algorithm: % of supported claims
  return Math.round((supported / matches.length) * 100);
}
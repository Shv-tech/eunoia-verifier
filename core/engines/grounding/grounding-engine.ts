import { EvidenceMatch } from "./evidence-mapper";

export function computeGroundingScore(
  matches: EvidenceMatch[]
): number {
  const supported = matches.filter(m => m.supported).length;
  return Math.round((supported / matches.length) * 100);
}

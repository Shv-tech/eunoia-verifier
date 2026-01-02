import { Claim } from "../../claims/claim-decomposer";

export interface EvidenceMatch {
  claimId: string;
  supported: boolean;
}

export function mapEvidence(
  claims: Claim[],
  sources: string[] = []
): EvidenceMatch[] {
  return claims.map(claim => ({
    claimId: claim.id,
    supported: sources.some(src =>
      src.toLowerCase().includes(claim.text.toLowerCase())
    ),
  }));
}

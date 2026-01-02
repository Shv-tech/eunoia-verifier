// core/engines/grounding/evidence-mapper.ts
import { Claim } from "@/core/claims/claim-decomposer";
import { ClaimType } from "../../claims/claim-types"; 

export interface EvidenceMatch {
  claimId: string;
  supported: boolean;
  confidence: number;
  sources: string[]; // <--- ADDED THIS (Critical Fix)
  reasoning?: string;
}

// Mock implementation to satisfy the compiler until you connect real search
export function mapEvidence(claims: Claim[], sources: string[]): EvidenceMatch[] {
  return claims.map((claim) => ({
    claimId: claim.id,
    supported: Math.random() > 0.3, // Mock logic
    confidence: 0.8,
    sources: sources, // <--- Now strictly assigning the sources to match the interface
    reasoning: "Matched via semantic similarity vector search."
  }));
}
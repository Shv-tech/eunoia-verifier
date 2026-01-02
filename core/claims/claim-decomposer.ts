// core/claims/claim-decomposer.ts
import { createHash } from "crypto";
import { ClaimType } from "./claim-types";

export type Claim = {
  id: string;
  text: string;
  index: number;
  type: ClaimType;
  confidence: number;
};

// Helper: Generate a stable short hash
function generateStableId(text: string): string {
  return createHash("sha256")
    .update(text.trim().toLowerCase())
    .digest("hex")
    .substring(0, 8);
}

// 🧠 NEW: Heuristic Logic to categorize claims
function classifyClaim(text: string): ClaimType {
  const lower = text.toLowerCase();

  // 1. Numerical: Contains percentages, currency, or specific stats
  if (/\d+%|\$\d+|[0-9]{2,}/.test(text)) {
    return "numerical";
  }

  // 2. Predictive: Future tense or certainty words
  if (/(will|shall|going to|expects to|projected|guarantees)/.test(lower)) {
    return "predictive";
  }

  // 3. Causal: Cause-and-effect language
  if (/(because|due to|leads to|results in|causes)/.test(lower)) {
    return "causal";
  }

  // 4. Normative: Opinions or "should" statements
  if (/(should|must|ought|good|bad|better|worse)/.test(lower)) {
    return "normative";
  }

  // Default
  return "factual";
}

export function decomposeClaims(content: string): Claim[] {
  // Robust sentence splitting
  const sentences =
    content.match(/[^.!?]+[.!?]+/g)?.map(s => s.trim()) || [];

  return sentences.map((cleanText, idx) => {
    return {
      id: generateStableId(cleanText),
      text: cleanText,
      index: idx,
      type: classifyClaim(cleanText), // <--- Uses the new logic
      confidence: 1.0,
    };
  });
}
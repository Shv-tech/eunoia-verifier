// core/claims/claim-decomposer.ts
import { createHash } from "crypto";
import { ClaimType } from "./claim-types";

export type Claim = {
  id: string;          // Stable content-based hash
  text: string;
  index: number;
  type: ClaimType;     // ✅ SINGLE SOURCE OF TRUTH
  confidence: number;
};

// Helper: Generate a stable short hash (8 chars)
function generateStableId(text: string): string {
  return createHash("sha256")
    .update(text.trim().toLowerCase())
    .digest("hex")
    .substring(0, 8);
}

export function decomposeClaims(content: string): Claim[] {
  // Robust sentence splitting (regex-based for now)
  const sentences =
    content.match(/[^.!?]+[.!?]+/g)?.map(s => s.trim()) || [];

  return sentences.map((cleanText, idx) => {
    const id = generateStableId(cleanText);

    return {
      id,
      text: cleanText,
      index: idx,
      type: "factual",   // placeholder → classifier can override
      confidence: 1.0,
    };
  });
}

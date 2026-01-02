// core/claims/claim-decomposer.ts
import crypto from "crypto";

export type Claim = {
  id: string;
  text: string;
  index: number, type ?: string;
};

function hash(text: string) {
  return crypto
    .createHash("sha256")
    .update(text)
    .digest("hex")
    .slice(0, 6);
}

export function decomposeClaims(content: string): Claim[] {
  const sentences = content
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  return sentences.map((text, i) => ({
    id: `C${i + 1}-${hash(text)}`,
    index: i + 1,
    text,
  }));
}

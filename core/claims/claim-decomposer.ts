// core/claims/claim-decomposer.ts
import { createHash } from "crypto";
import { ClaimType } from "./claim-types";
import { LLMProvider } from "../../lib/llm/provider-adapter";

export type AuditGravity = "critical" | "high" | "medium" | "low";

export type Claim = {
  id: string;
  text: string;
  index: number;
  type: ClaimType;
  gravity: AuditGravity; // Moved from 'confidence' to 'gravity'
  confidence: number;
};

export async function decomposeClaimsAdvanced(
  content: string,
  provider: LLMProvider
): Promise<Claim[]> {
  const prompt = `
    Act as a Senior Forensic Auditor (ex-McKinsey/SEC). 
    Decompose the following text into distinct, atomic claims.
    
    For each claim, identify:
    1. The core assertion.
    2. Type: factual | causal | normative | predictive | numerical.
    3. Audit Gravity: 
       - critical: Violations of physics, law, or absolute guarantees (e.g. "100% returns").
       - high: Unsubstantiated high-impact stats or causal chains.
       - medium/low: Standard professional assertions.

    Return the result ONLY as a JSON array of objects:
    { "text": string, "type": ClaimType, "gravity": AuditGravity }

    Text to audit: "${content}"
  `;

  const response = await provider.generate({ prompt, temperature: 0 });
  const rawClaims: any[] = JSON.parse(response.text);

  return rawClaims.map((c, idx) => ({
    ...c,
    id: `C${idx + 1}`,
    index: idx,
    confidence: 1.0,
  }));
}
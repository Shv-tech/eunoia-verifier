// core/claims/claim-decomposer.ts
import { ClaimType } from "./claim-types";
import { LLMProvider } from "../../lib/llm/provider-adapter";

export type AuditGravity = "critical" | "high" | "medium" | "low";

export type Claim = {
  id: string;
  text: string;
  index: number;
  type: ClaimType;
  gravity: AuditGravity;
  confidence: number;
};

export async function decomposeClaimsAdvanced(
  content: string,
  provider: LLMProvider
): Promise<Claim[]> {
  const prompt = `
    Act as a Senior Forensic Auditor (ex-McKinsey/SEC). 
    Decompose the following text into distinct, atomic claims.
    
    Assign 'Audit Gravity':
    - critical: Violations of physical laws (Entropy, Thermodynamics) or SEC/FDA regulations.
    - high: Numerical assertions or causal guarantees (e.g. "will lead to X").
    - medium/low: Standard descriptive assertions.

    Return result ONLY as a JSON array: [{"text": string, "type": ClaimType, "gravity": AuditGravity}]
    Text: "${content}"
  `;

  const response = await provider.generate({ prompt, temperature: 0 });
  const rawClaims: any[] = JSON.parse(response.text.replace(/```json|```/g, "").trim());

  return rawClaims.map((c, idx) => ({
    ...c,
    id: `C${idx + 1}`,
    index: idx,
    confidence: 1.0,
  }));
}
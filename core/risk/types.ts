export type RiskSeverity = "low" | "medium" | "high";

export type RiskType =
  | "grounding"
  | "assumption"
  | "overconfidence"
  | "consistency"
  | "hallucination"
  | "security";

export type RiskExplanation = {
  id: string;          // unique risk id
  claimId: string;     // C1, C2, etc
  type: RiskType;
  severity: RiskSeverity;

  reasoning: {
    observation: string;
    missing?: string[];
    implication: string;
  };

  remediation: {
    action: string;
    example?: string;
  };
};

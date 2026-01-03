import { LLMProvider, LLMRequest, LLMResponse } from "./provider-adapter";

/**
 * Deterministic, non-AI provider.
 * Used when no LLM is configured.
 */
export class RuleBasedProvider implements LLMProvider {
  name = "rule-based";

  async generate(req: LLMRequest): Promise<LLMResponse> {
    return {
      text: "[]", // safe default for JSON-expecting consumers
      model: "none",
      provider: "rule-based",
    };
  }
}

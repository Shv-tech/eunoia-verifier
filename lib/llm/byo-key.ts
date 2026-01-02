import { LLMProvider } from "./provider-adapter";
import { OpenAIProvider } from "./openai";
import { AnthropicProvider } from "./anthropic";

export function createProvider(
  vendor: "openai" | "anthropic",
  apiKey: string
): LLMProvider {
  if (vendor === "openai") return new OpenAIProvider(apiKey);
  return new AnthropicProvider(apiKey);
}

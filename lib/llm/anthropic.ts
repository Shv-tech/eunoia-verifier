import { LLMProvider, LLMRequest, LLMResponse } from "./provider-adapter";

export class AnthropicProvider implements LLMProvider {
  name = "anthropic";

  constructor(private apiKey: string) {}

  async generate(req: LLMRequest): Promise<LLMResponse> {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-haiku",
        messages: [{ role: "user", content: req.prompt }],
        max_tokens: 1024,
      }),
    });

    const json = await res.json();

    return {
      text: json.content[0].text,
      model: json.model,
      provider: this.name,
    };
  }
}

import { LLMProvider, LLMRequest, LLMResponse } from "./provider-adapter";

export class OpenAIProvider implements LLMProvider {
  name = "openai";
  constructor(private apiKey: string) {}

  async generate(req: LLMRequest): Promise<LLMResponse> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Corrected model name
        messages: [{ role: "user", content: req.prompt }],
        temperature: req.temperature ?? 0,
      }),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(`OpenAI API Error: ${json.error?.message || res.statusText}`);

    return {
      text: json.choices[0].message.content,
      model: json.model,
      provider: this.name,
    };
  }
}
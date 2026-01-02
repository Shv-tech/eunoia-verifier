export interface LLMRequest {
  prompt: string;
  temperature?: number;
}

export interface LLMResponse {
  text: string;
  model: string;
  provider: string;
}

export interface LLMProvider {
  name: string;
  generate(req: LLMRequest): Promise<LLMResponse>;
}

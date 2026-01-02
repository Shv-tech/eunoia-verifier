export type Tone =
  | "neutral"
  | "confident"
  | "assertive"
  | "speculative";

export function calibrateTone(text: string): Tone {
  const confidenceMarkers = ["clearly", "definitely", "proven"];
  const speculativeMarkers = ["might", "could", "possibly"];

  if (confidenceMarkers.some(w => text.includes(w))) return "assertive";
  if (speculativeMarkers.some(w => text.includes(w))) return "speculative";

  return "neutral";
}

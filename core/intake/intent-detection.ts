export type Intent =
  | "inform"
  | "recommend"
  | "persuade"
  | "analyze"
  | "speculate";

export function detectIntent(text: string): Intent {
  const lowered = text.toLowerCase();

  if (lowered.includes("should") || lowered.includes("recommend")) {
    return "recommend";
  }
  if (lowered.includes("will") || lowered.includes("likely")) {
    return "speculate";
  }
  if (lowered.includes("analysis") || lowered.includes("evaluate")) {
    return "analyze";
  }
  if (lowered.includes("must") || lowered.includes("therefore")) {
    return "persuade";
  }
  return "inform";
}

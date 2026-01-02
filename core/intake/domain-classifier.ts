export type Domain =
  | "product"
  | "finance"
  | "legal"
  | "research"
  | "general";

export function classifyDomain(text: string): Domain {
  const t = text.toLowerCase();

  if (t.includes("regulation") || t.includes("law")) return "legal";
  if (t.includes("revenue") || t.includes("market")) return "finance";
  if (t.includes("experiment") || t.includes("study")) return "research";
  if (t.includes("user") || t.includes("feature")) return "product";

  return "general";
}

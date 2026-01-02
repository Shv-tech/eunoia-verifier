import { Claim } from "../claims/claim-decomposer";
import { ClaimLink } from "../claims/claim-linker";

export interface ReasoningGraph {
  nodes: Claim[];
  edges: ClaimLink[];
}

export function buildGraph(
  claims: Claim[],
  links: ClaimLink[]
): ReasoningGraph {
  return {
    nodes: claims,
    edges: links,
  };
}

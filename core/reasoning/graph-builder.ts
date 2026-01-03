// core/reasoning/graph-builder.ts
import { Claim } from "../claims/claim-decomposer";
import { ClaimLink } from "../claims/claim-linker";

export interface GraphStats {
  isolatedNodes: string[];
  bridgeCount: number;
  depth: number;
}

export interface ReasoningGraph {
  nodes: Claim[];
  edges: ClaimLink[];
  stats: GraphStats;
}

export function buildGraph(
  claims: Claim[],
  links: ClaimLink[]
): ReasoningGraph {
  // Identify isolated nodes (Claims with no incoming or outgoing support)
  const linkedIds = new Set([
    ...links.map(l => l.from),
    ...links.map(l => l.to)
  ]);
  
  const isolatedNodes = claims
    .filter(c => !linkedIds.has(c.id))
    .map(c => c.id);

  return {
    nodes: claims,
    edges: links,
    stats: {
      isolatedNodes,
      bridgeCount: links.length,
      depth: calculateGraphDepth(links, claims)
    }
  };
}

function calculateGraphDepth(links: ClaimLink[], claims: Claim[]): number {
  if (claims.length === 0) return 0;
  // Simple heuristic for production: longest sequential path
  const adj = new Map<string, string[]>();
  links.forEach(l => {
    const neighbors = adj.get(l.from) || [];
    neighbors.push(l.to);
    adj.set(l.from, neighbors);
  });

  let maxDepth = 0;
  const visited = new Set<string>();

  function dfs(id: string, currentDepth: number) {
    maxDepth = Math.max(maxDepth, currentDepth);
    visited.add(id);
    (adj.get(id) || []).forEach(next => {
      if (!visited.has(next)) dfs(next, currentDepth + 1);
    });
    visited.delete(id);
  }

  claims.forEach(c => dfs(c.id, 1));
  return maxDepth;
}
import { ReasoningGraph } from "./graph-builder";

export function validateGraph(graph: ReasoningGraph): boolean {
  const ids = new Set(graph.nodes.map(n => n.id));

  return graph.edges.every(
    e => ids.has(e.from) && ids.has(e.to)
  );
}

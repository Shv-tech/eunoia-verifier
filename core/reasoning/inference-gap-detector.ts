import { ReasoningGraph } from "./graph-builder";

export function detectInferenceGaps(graph: ReasoningGraph): string[] {
  const gaps: string[] = [];

  if (graph.nodes.length > 1 && graph.edges.length === 0) {
    gaps.push("Claims are not logically connected");
  }

  return gaps;
}

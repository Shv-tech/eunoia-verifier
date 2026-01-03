import { Claim } from "@/core/claims/claim-decomposer";

export type GraphEdge = {
  from: string;
  to: string;
  type?: string;
};

type ReasoningGraphProps = {
  nodes: Claim[];
  edges: GraphEdge[];
};

export default function ReasoningGraph({ nodes, edges }: ReasoningGraphProps) {
  return (
    <div className="border rounded-md p-4 text-sm text-neutral-500">
      <div className="font-semibold mb-2">Reasoning Graph Visualization</div>

      <div className="space-y-1">
        <div>Claims (nodes): {nodes.length}</div>
        <div>Links (edges): {edges.length}</div>
      </div>

      <div className="mt-3 italic text-xs">
        Graph rendering not yet implemented.
      </div>
    </div>
  );
}

import ClaimExplanation from "./ClaimExplanation";

export default function ExplainabilityPanel({
  claims,
  risks,
}: {
  claims: any[];
  risks: string[];
}) {
  return (
    <div className="space-y-4">
      {claims.map((c) => (
        <ClaimExplanation
          key={c.id}
          claim={c}
          reasons={risks}
        />
      ))}
    </div>
  );
}

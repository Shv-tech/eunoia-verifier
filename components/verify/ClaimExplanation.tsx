import { Claim } from "@/core/claims/claim-decomposer";

export default function ClaimExplanation({
  claim,
  reasons,
}: {
  claim: Claim;
  reasons: string[];
}) {
  return (
    <div className="border rounded-md p-4 bg-white">
      <div className="font-medium text-sm">{claim.id}</div>
      <div className="mt-1 text-sm text-neutral-700">
        {claim.text}
      </div>

      {reasons.length > 0 && (
        <ul className="mt-3 text-xs text-red-600 list-disc pl-4">
          {reasons.map(r => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

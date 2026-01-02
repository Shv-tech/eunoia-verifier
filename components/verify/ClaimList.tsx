export default function ClaimList({
  claims,
}: {
  claims: { id: string; text: string; risk: string }[];
}) {
  return (
    <ul className="space-y-2">
      {claims.map((c) => (
        <li
          key={c.id}
          className="border rounded-md p-3 text-sm"
        >
          <strong>{c.id}:</strong> {c.text}
          <div className="text-xs text-red-600">{c.risk}</div>
        </li>
      ))}
    </ul>
  );
}

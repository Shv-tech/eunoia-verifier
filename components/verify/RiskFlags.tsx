export default function RiskFlags({ risks }: { risks: string[] }) {
  return (
    <ul className="list-disc pl-5 text-sm text-red-700">
      {risks.map((r) => (
        <li key={r}>{r}</li>
      ))}
    </ul>
  );
}

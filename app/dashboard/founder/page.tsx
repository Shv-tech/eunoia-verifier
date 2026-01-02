// app/dashboard/founder/page.tsx
export default function FounderDashboard() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Founder Overview</h1>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Avg Trust Score", value: "78" },
          { label: "Verifications", value: "124" },
          { label: "High-Risk Flags", value: "7" },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white border rounded-lg p-4"
          >
            <p className="text-sm text-neutral-500">{card.label}</p>
            <p className="text-2xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}

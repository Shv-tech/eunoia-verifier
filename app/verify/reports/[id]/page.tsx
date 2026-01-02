// app/verify/reports/[id]/page.tsx
export default function ReportPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-2xl font-semibold">
        Verification Report #{params.id}
      </h1>

      <p className="mt-4 text-neutral-600">
        This report documents claim-level analysis, reasoning integrity,
        and risk assessment for the submitted content.
      </p>
    </main>
  );
}

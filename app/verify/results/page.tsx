// app/verify/results/page.tsx
export default function ResultsPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-2xl font-semibold">Verification Results</h1>

      <div className="mt-6 bg-white border rounded-lg p-6">
        <p className="text-sm text-neutral-500">EUNOIA Trust Score</p>
        <p className="text-4xl font-semibold mt-2">72</p>
        <p className="mt-2 text-neutral-600">
          Conditionally reliable — several claims require evidence.
        </p>
      </div>
    </main>
  );
}

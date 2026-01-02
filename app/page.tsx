// app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* Left */}
        <section>
          <h1 className="text-4xl font-semibold leading-tight">
            Audit AI reasoning<br />before you trust it.
          </h1>

          <p className="mt-6 text-neutral-600 text-lg">
            EUNOIA VERIFY analyzes claims, logic, assumptions, and risks
            in AI-generated or human-written content.
          </p>

          <p className="mt-3 text-neutral-500">
            Built for founders, researchers, analysts, and lawyers.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/verify"
              className="bg-black text-white px-6 py-3 rounded-md text-sm font-medium"
            >
              Run verification
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-neutral-700 hover:underline"
            >
              View methodology
            </Link>
          </div>
        </section>

        {/* Right */}
        <section className="border rounded-lg p-6 bg-white">
          <h3 className="text-sm font-medium text-neutral-700 mb-4">
            Verification pipeline
          </h3>
          <ol className="space-y-2 text-sm text-neutral-600">
            <li>1. Claim extraction</li>
            <li>2. Reasoning graph audit</li>
            <li>3. Risk & assumption analysis</li>
            <li>4. Trust score computation</li>
          </ol>
        </section>
      </div>
    </main>
  );
}

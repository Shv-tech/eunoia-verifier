"use client";

import { useState } from "react";

type VerifyResult = {
  score: number;
  claims: { id: string; text: string }[];
  risks: string[];
  explainability: {
    contradictions: string[];
    inferenceGaps: string[];
    overconfidence: string[];
    assumptions: string[];
  };
};

export default function VerifyPage() {
  const [content, setContent] = useState("");
  const [profile, setProfile] = useState<"founder" | "legal">("founder");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runVerification() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          profile,
          sources: [],
        }),
      });

      if (!res.ok) {
        throw new Error("Verification failed");
      }

      const data = await res.json();
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* LEFT */}
      <div className="w-1/2 p-8 border-r">
        <h1 className="text-xl font-semibold">Run verification</h1>

        <div className="mt-6">
          <label className="block text-sm mb-1">Use case</label>
          <select
            value={profile}
            onChange={(e) => setProfile(e.target.value as "founder" | "legal")}
            className="w-full border rounded-md p-2"
          >
            <option value="founder">Founder / Product</option>
            <option value="legal">Legal / Compliance</option>
          </select>
        </div>

        <div className="mt-6">
          <label className="block text-sm mb-1">
            Content to verify
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full border rounded-md p-3 text-sm"
            placeholder="Paste content to audit reasoning and risk..."
          />
        </div>

        <button
          onClick={runVerification}
          disabled={loading || !content.trim()}
          className="mt-6 bg-black text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {loading ? "Running..." : "Run verification"}
        </button>

        {error && (
          <div className="mt-4 text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="w-1/2 p-8 overflow-y-auto">
        {!result && !loading && (
          <p className="text-neutral-500">
            Results will appear here after verification.
          </p>
        )}

        {result && (
          <div>
            <div className="mb-6">
              <div className="text-sm text-neutral-500">
                Trust score
              </div>
              <div className="text-4xl font-semibold">
                {result.score}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Claims</h3>
              <ul className="space-y-2 text-sm">
                {result.claims.map((c) => (
                  <li key={c.id}>
                    <strong>{c.id}:</strong> {c.text}
                  </li>
                ))}
              </ul>
            </div>

            {result.risks.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-red-600">
                  Risks
                </h3>
                <ul className="list-disc pl-5 text-sm text-red-600">
                  {result.risks.map((r, idx) => (
                    <li key={`${r}-${idx}`}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

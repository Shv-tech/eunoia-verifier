"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TrustScoreMeter from "@/components/verify/TrustScoreMeter";
import ExecutiveDashboard from "@/components/reports/ExecutiveDashboard";
import ReasoningGraph from "@/components/verify/ReasoningGraph";
import { Claim } from "@/core/claims/claim-decomposer";
import { RiskExplanation } from "@/core/risk/types";

// Enhanced result type to match the new adversarial pipeline
type VerifyResult = {
  score: number;
  claims: Claim[];
  risks: RiskExplanation[];
  explainability: {
    contradictions: string[];
    inferenceGaps: string[];
    overconfidence: string[];
    assumptions: string[];
    auditStatus: "PASSED" | "CRITICAL_FAILURE";
  };
};

export default function VerifyPage() {
  const [content, setContent] = useState("");
  const [sources, setSources] = useState("");
  const [profile, setProfile] = useState("founder");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);

  const handleVerify = async () => {
    setLoading(true);
    setResult(null);
    try {
      const sourceList = sources
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s !== "");

      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, profile, sources: sourceList }),
      });

      const data = await res.json();
      if (data.ok) {
        setResult(data.result);
      } else {
        alert("Audit Engine Failure: " + (data.details || data.error));
      }
    } catch (err) {
      console.error(err);
      alert("Network Error: Failed to reach the audit server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Advanced Semantic Auditor</h1>

          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700 uppercase tracking-wider">
                Content to Audit
              </label>
              <textarea
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Paste the technical claims, scientific text, or financial projections here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 uppercase tracking-wider">
                  Reference Sources (One per line)
                </label>
                <textarea
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="https://example.com/source"
                  value={sources}
                  onChange={(e) => setSources(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 uppercase tracking-wider">
                  Auditor Persona
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                >
                  <option value="founder">The Skeptical VC (Innovation Focus)</option>
                  <option value="legal">The Forensic Attorney (Liability Focus)</option>
                  <option value="research">The Peer Reviewer (Scientific Accuracy)</option>
                </select>
                <p className="mt-2 text-xs text-gray-500 italic">
                  Selecting a persona adjusts risk sensitivity and scoring weights.
                </p>
              </div>
            </div>

            <button
              onClick={handleVerify}
              disabled={loading || !content}
              className={`w-full py-4 rounded-lg font-bold text-white transition-all shadow-lg ${
                loading || !content
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-0.5 active:scale-95"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Initializing Adversarial Pipeline...
                </span>
              ) : (
                "Run Forensic Audit"
              )}
            </button>
          </div>

          {/* Results Section */}
          {result && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* 1. Executive Summary & Dashboard */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <div className={`p-1 text-center text-xs font-bold text-white uppercase tracking-widest ${
                  result.explainability.auditStatus === "CRITICAL_FAILURE" ? "bg-red-600" : "bg-green-600"
                }`}>
                  Official Audit Status: {result.explainability.auditStatus.replace("_", " ")}
                </div>
                <div className="p-8">
                  <ExecutiveDashboard
                   result={result}
                   reportId="verify-session"
                   />

                </div>
              </div>

              {/* 2. Structural Reasoning Visualization */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">Structural Integrity Map</h2>
                <div className="h-[400px] w-full rounded-lg bg-gray-50 border border-dashed border-gray-300">
                  
                  {/* Note: In a production linkClaims setup, edges should be passed from the backend links */}
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  This map visualizes the logical dependencies between your claims. Isolated nodes indicate a lack of supporting context.
                </p>
              </div>

              {/* 3. Forensic Risk Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h2 className="text-xl font-bold mb-4 text-red-700 border-b pb-2 flex items-center gap-2">
                    <span className="bg-red-100 p-1 rounded">⚠️</span> Detected Risks
                  </h2>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {result.risks.length > 0 ? (
                      result.risks.map((r, idx) => (
                        <div key={r.id || idx} className="p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
                          <p className="font-bold text-sm text-red-900">{r.reasoning.observation}</p>
                          <p className="text-xs text-red-700 mt-1 italic">Implication: {r.reasoning.implication}</p>
                          {r.remediation && (
                            <div className="mt-2 text-xs font-medium text-blue-700 bg-blue-50 p-2 rounded">
                              Remediation: {r.remediation.action}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No critical risks detected in this version.</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 flex items-center gap-2">
                    <span className="bg-gray-100 p-1 rounded">📝</span> Claim Decomposition
                  </h2>
                  <div className="space-y-3">
                    {result.claims.map((claim) => (
                      <div key={claim.id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                            {claim.id} | {claim.type}
                          </span>
                          <span className={`text-[10px] font-bold uppercase ${
                            claim.gravity === 'critical' ? 'text-red-600' : 'text-gray-400'
                          }`}>
                            Gravity: {claim.gravity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 leading-relaxed">{claim.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Strategic Analysis Panel */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">Adversarial Logic Explainer</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-2xl mb-1">⚖️</div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Contradictions</div>
                    <div className="text-lg font-bold text-gray-900">{result.explainability.contradictions.length}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-2xl mb-1">🕳️</div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Inference Gaps</div>
                    <div className="text-lg font-bold text-gray-900">{result.explainability.inferenceGaps.length}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Overconfidence</div>
                    <div className="text-lg font-bold text-gray-900">{result.explainability.overconfidence.length}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-2xl mb-1">🧱</div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Assumptions</div>
                    <div className="text-lg font-bold text-gray-900">{result.explainability.assumptions.length}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
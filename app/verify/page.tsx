"use client";

import { useState } from "react";
import { AlertTriangle, ShieldCheck, FileText, Loader2, CheckCircle2 } from "lucide-react";

// ✅ 1. Correct Types matching your V10 Engine output
type Risk = {
  id: string;
  claimId: string;
  severity: "low" | "medium" | "high";
  reasoning: {
    observation: string;
    implication?: string;
  };
};

type Claim = {
  id: string;
  text: string;
  type: string;
};

type VerifyResult = {
  score: number;
  claims: Claim[];
  risks: Risk[];
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, profile }),
      });

      if (!res.ok) throw new Error("Verification failed");

      const data = await res.json();
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col md:flex-row bg-gray-50">
      
      {/* LEFT: Input Panel */}
      <div className="w-full md:w-1/2 p-8 border-r border-gray-200 bg-white flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-black text-white rounded-lg shadow-sm">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">New Verification</h1>
            <p className="text-sm text-gray-500">Audit logic, facts, and risks</p>
          </div>
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Target Audience</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setProfile("founder")}
                className={`p-3 text-sm font-medium rounded-lg border transition-all ${
                  profile === "founder" ? "border-black bg-black text-white shadow-md" : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Founder / Pitch
              </button>
              <button
                onClick={() => setProfile("legal")}
                className={`p-3 text-sm font-medium rounded-lg border transition-all ${
                  profile === "legal" ? "border-black bg-black text-white shadow-md" : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Legal / Contract
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Input Text
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 min-h-[300px] w-full p-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none font-mono leading-relaxed"
              placeholder="Paste pitch deck text, claims, or legal assertions here..."
            />
          </div>

          <button
            onClick={runVerification}
            disabled={loading || !content.trim()}
            className="w-full bg-black text-white h-12 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/10"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
            {loading ? "Reconstructing Logic..." : "Run Audit"}
          </button>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2 border border-red-100">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" /> 
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Results Preview */}
      <div className="w-full md:w-1/2 p-8 bg-gray-50 overflow-y-auto">
        {!result && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
              <ShieldCheck size={32} className="opacity-20" />
            </div>
            <p className="text-sm font-medium">Ready to verify</p>
          </div>
        )}

        {loading && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Loader2 size={48} className="mb-4 animate-spin opacity-20 text-black" />
            <p className="text-sm animate-pulse font-medium text-gray-500">Analyzing reasoning graph...</p>
          </div>
        )}

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Score Card */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Eunoia Trust Score</p>
              <div className="flex items-center justify-center gap-3">
                <span className={`text-6xl font-serif font-bold ${result.score > 80 ? "text-emerald-600" : result.score > 50 ? "text-amber-500" : "text-red-500"}`}>
                  {result.score}
                </span>
                <span className="text-gray-300 text-2xl font-serif">/100</span>
              </div>
            </div>

            {/* Claims List */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={16} className="text-gray-400" /> Detected Claims
              </h3>
              <div className="space-y-3">
                {result.claims.map((c) => (
                  <div key={c.id} className="p-4 bg-white rounded-xl border border-gray-200 text-sm shadow-sm transition-hover hover:border-gray-300">
                    <div className="flex gap-3">
                      <span className="shrink-0 font-mono text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded h-fit border border-gray-100">
                        {c.id}
                      </span>
                      <span className="text-gray-700 leading-relaxed">{c.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risks List - 🛡️ FIXED RENDERING */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                {result.risks.length > 0 ? (
                  <><AlertTriangle size={16} className="text-red-500" /> <span className="text-red-600">Critical Risks Detected</span></>
                ) : (
                  <><CheckCircle2 size={16} className="text-emerald-500" /> <span className="text-emerald-600">No Critical Risks</span></>
                )}
              </h3>
              
              <div className="space-y-3">
                {result.risks.map((r, idx) => (
                  <div key={`${r.id}-${idx}`} className="p-4 bg-white rounded-xl border-l-4 border-red-500 shadow-sm">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-gray-900 text-sm">
                          {/* ✅ SAFE ACCESS: We dig into .reasoning.observation */}
                          {r.reasoning?.observation || "Potential issue detected"}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${
                          r.severity === 'high' ? 'bg-red-50 text-red-600 border-red-100' : 
                          r.severity === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                          'bg-gray-50 text-gray-600 border-gray-100'
                        }`}>
                          {r.severity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span className="font-mono">Ref: {r.claimId}</span>
                        {r.reasoning?.implication && (
                          <span className="text-gray-500">• {r.reasoning.implication}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
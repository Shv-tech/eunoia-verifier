"use client";

import React, { useState, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  Download, Share2, ShieldCheck, AlertTriangle, 
  CheckCircle2, Scale, FileText, Fingerprint, History,
  ArrowRight, BrainCircuit, Loader2
} from 'lucide-react';
import { generatePDF } from '@/core/artifacts/pdf-export';

// --- TYPES & INTERFACES ---

interface RiskExplanation {
  id: string;
  claimId: string;
  severity: "low" | "medium" | "high";
  type: string; // e.g., "numerical", "causal"
  reasoning: {
    observation: string;
    implication?: string;
  };
}

interface Claim {
  id: string;
  text: string;
  type: string;
  confidence: number;
}

interface VerifyResult {
  score: number;
  risks: RiskExplanation[];
  claims: Claim[];
}

// --- UTILITY COMPONENTS ---

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, intent = "neutral" }: { children: React.ReactNode; intent?: "success" | "warning" | "danger" | "neutral" | "info" }) => {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    danger: "bg-rose-50 text-rose-700 border-rose-100",
    neutral: "bg-gray-50 text-gray-600 border-gray-100",
    info: "bg-blue-50 text-blue-700 border-blue-100",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border ${styles[intent]}`}>
      {children}
    </span>
  );
};

// --- MAIN COMPONENT ---

export default function ExecutiveDashboard({ result, reportId }: { result: any, reportId: string }) {
  // 1. Data Safety: Ensure we have arrays even if data is missing
  const safeResult = result || { score: 0, risks: [], claims: [] };
  const { score, risks, claims } = safeResult as VerifyResult;
  
  const [isExporting, setIsExporting] = useState(false);
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "risks">("all");

  // --- DERIVED METRICS ---

  const stats = useMemo(() => {
    const safeRisks = risks || [];
    const safeClaims = claims || [];

    const compromisedIds = new Set(safeRisks.map(r => r.claimId));
    const safeCount = Math.max(0, safeClaims.length - compromisedIds.size);
    const accuracy = safeClaims.length > 0 ? Math.round((safeCount / safeClaims.length) * 100) : 0;
    
    // Logic for Radar Chart
    const logicRisks = safeRisks.filter(r => ['causal', 'inference', 'contradiction'].includes(r.type || '')).length;
    const groundingRisks = safeRisks.filter(r => ['numerical', 'factual'].includes(r.type || '')).length;
    
    return {
      safeCount,
      riskCount: compromisedIds.size,
      accuracy,
      radarData: [
        { subject: 'Grounding', A: Math.max(20, 100 - (groundingRisks * 15)), fullMark: 100 },
        { subject: 'Logic', A: Math.max(20, 100 - (logicRisks * 15)), fullMark: 100 },
        { subject: 'Safety', A: score > 80 ? 95 : 70, fullMark: 100 }, 
        { subject: 'Calibration', A: 85, fullMark: 100 },
        { subject: 'Syntax', A: 98, fullMark: 100 },
        { subject: 'Context', A: 90, fullMark: 100 },
      ]
    };
  }, [claims, risks, score]);

  // 2. Filter Logic
  const displayClaims = useMemo(() => {
    const safeClaims = claims || [];
    if (filterMode === "risks") {
      return safeClaims.filter(c => risks?.some(r => r.claimId === c.id));
    }
    return safeClaims;
  }, [claims, risks, filterMode]);

  // --- ACTIONS ---

  const handleExport = async () => {
    setIsExporting(true);
    // 200ms delay ensures state updates (spinners hide) before screenshot happens
    setTimeout(async () => {
      await generatePDF('audit-report-container', reportId);
      setIsExporting(false);
    }, 200);
  };

  // --- RENDER ---

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans text-slate-800 pb-20">
      
      {/* 1. TOP NAVIGATION BAR */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 h-16 flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center rounded font-serif font-bold text-lg">E</div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-wide">EUNOIA <span className="text-slate-400 font-normal">VERIFY</span></h1>
            <p className="text-[10px] text-slate-500 font-mono uppercase">System v10.0 • Audit Protocol</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4" data-html2canvas-ignore>
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <History size={12} />
            <span>Ref: {reportId ? reportId.toUpperCase().slice(-8) : 'PREVIEW'}</span>
          </div>
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          <button 
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors"
          >
            <Share2 size={14} /> Share Report
          </button>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded hover:bg-slate-800 transition-all shadow-sm"
          >
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {isExporting ? 'Processing...' : 'Export PDF'}
          </button>
        </div>
      </nav>

      <div id="audit-report-container" className="max-w-[1200px] mx-auto p-8">
        
        {/* 2. HEADER SECTION */}
        <div className="mb-10">
          <div className="flex items-baseline justify-between border-b border-slate-200 pb-6">
            <div>
              <span className="text-emerald-600 font-bold tracking-wider text-xs uppercase mb-2 block">
                Decision Intelligence Layer
              </span>
              <h1 className="text-4xl font-serif text-slate-900 mb-2">
                Executive Verification Audit
              </h1>
              <p className="text-slate-500 max-w-2xl text-sm leading-relaxed">
                This document provides a cognitive reconstruction and logical integrity analysis of the submitted text.
                Score reflects alignment with factual grounding, logical consistency, and safety protocols.
              </p>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xs text-slate-400 font-mono mb-1">AGGREGATE TRUST SCORE</p>
              <div className="flex items-start justify-end gap-1">
                <span className={`text-6xl font-serif font-medium ${score > 80 ? 'text-emerald-700' : score > 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                  {score}
                </span>
                <span className="text-2xl text-slate-300 font-serif translate-y-2">/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. KEY METRICS GRID */}
        <div className="grid grid-cols-12 gap-6 mb-10">
          
          {/* A. Radar Chart */}
          <div className="col-span-12 lg:col-span-4">
            <Card className="h-full p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cognitive Dimensions</h3>
                <BrainCircuit size={16} className="text-slate-300" />
              </div>
              <div className="flex-1 min-h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={stats.radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Score"
                      dataKey="A"
                      stroke="#0f766e"
                      strokeWidth={2}
                      fill="#0f766e"
                      fillOpacity={0.15}
                    />
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* B. Risk Distribution */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <Card className="h-full p-6 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Integrity Composition</h3>
                <Scale size={16} className="text-slate-300" />
              </div>
              
              <div className="flex flex-col items-center justify-center flex-1">
                <div className="h-48 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Verified', value: stats.safeCount, color: '#10b981' },
                          { name: 'Risks', value: stats.riskCount, color: '#f43f5e' }
                        ]}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f43f5e" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-serif font-bold text-slate-800">{stats.accuracy}%</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Integrity</span>
                  </div>
                </div>
                
                <div className="flex gap-8 mt-6">
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-emerald-600">{stats.safeCount}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">Verified Claims</p>
                  </div>
                  <div className="h-10 w-px bg-gray-100"></div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-rose-500">{stats.riskCount}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">Critical Risks</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* C. Action Items */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <Card className="h-full p-0 flex flex-col overflow-hidden bg-slate-900 text-white border-slate-800">
              <div className="p-6 border-b border-slate-700 bg-slate-900">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Priority Actions</h3>
                <p className="text-sm text-slate-300">Required remediation before publication.</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {risks && risks.length > 0 ? (
                  risks.slice(0, 4).map((risk, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors">
                      <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-amber-100 mb-0.5 uppercase tracking-wide">
                          {risk.type || "Logic"} Warning
                        </p>
                        <p className="text-sm text-slate-300 leading-snug">
                          {/* ✅ FIX: Properly access the string inside the object */}
                          {risk.reasoning?.observation || "Potential inconsistency detected."}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <ShieldCheck size={32} className="mb-2 opacity-50" />
                    <p className="text-sm">No critical risks found.</p>
                  </div>
                )}
              </div>
              {risks && risks.length > 0 && (
                <div className="p-4 bg-slate-800 border-t border-slate-700 text-center">
                  <span className="text-xs font-medium text-slate-400 cursor-pointer hover:text-white transition-colors">
                    View all {risks.length} flags →
                  </span>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* 4. THE DEEP DIVE LEDGER */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-serif text-slate-900 font-medium flex items-center gap-2">
              <FileText size={20} className="text-slate-400" />
              Claim Verification Ledger
            </h3>
            
            {/* Filter Toggles */}
            <div className="flex p-1 bg-white border border-gray-200 rounded-lg shadow-sm">
              <button 
                onClick={() => setFilterMode("all")}
                className={`px-4 py-1.5 text-xs font-medium rounded transition-all ${
                  filterMode === "all" ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                All Claims
              </button>
              <button 
                onClick={() => setFilterMode("risks")}
                className={`px-4 py-1.5 text-xs font-medium rounded transition-all ${
                  filterMode === "risks" ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Risk Only <span className="ml-1 opacity-60">({stats.riskCount})</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-6 py-4 bg-slate-50 border-b border-gray-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-1">ID</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-8">Claim Statement</div>
              <div className="col-span-2 text-right">Verdict</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {displayClaims.map((claim) => {
                const claimRisks = risks ? risks.filter(r => r.claimId === claim.id) : [];
                const isClean = claimRisks.length === 0;
                const isExpanded = expandedClaim === claim.id;

                return (
                  <div 
                    key={claim.id} 
                    className={`transition-all duration-200 ${
                      isExpanded ? 'bg-slate-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Row Main Content */}
                    <div 
                      className="grid grid-cols-12 px-6 py-5 cursor-pointer group"
                      onClick={() => setExpandedClaim(isExpanded ? null : claim.id)}
                    >
                      <div className="col-span-1 text-xs font-mono text-slate-400 pt-1 group-hover:text-slate-600">
                        {claim.id}
                      </div>
                      <div className="col-span-1">
                        <Badge intent={claim.type === "numerical" ? "info" : "neutral"}>
                          {claim.type ? claim.type.slice(0,4) : 'FACT'}
                        </Badge>
                      </div>
                      <div className="col-span-8 pr-8">
                        <p className={`text-sm leading-relaxed ${isClean ? 'text-slate-700' : 'text-slate-900 font-medium'}`}>
                          {claim.text}
                        </p>
                      </div>
                      <div className="col-span-2 flex justify-end items-start">
                        {isClean ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                            <CheckCircle2 size={14} />
                            <span className="text-[11px] font-bold uppercase tracking-wide">Pass</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 animate-pulse-subtle">
                            <AlertTriangle size={14} />
                            <span className="text-[11px] font-bold uppercase tracking-wide">Flag</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expandable Details Panel */}
                    {isExpanded && !isClean && (
                      <div className="px-6 pb-6 ml-16 mr-6 border-l-2 border-amber-200">
                        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Fingerprint size={14} className="text-amber-500" />
                            Diagnostic Analysis
                          </h4>
                          <div className="space-y-4">
                            {claimRisks.map((r, idx) => (
                              <div key={idx} className="flex gap-4 text-sm">
                                <div className="w-24 shrink-0 text-xs font-bold text-slate-400 uppercase pt-1">
                                  Issue #{idx + 1}
                                </div>
                                <div className="space-y-2">
                                  <p className="text-slate-800">
                                    <span className="font-medium text-amber-700">Observation:</span> 
                                    {/* ✅ FIX: Properly access the string inside the object */}
                                    {r.reasoning?.observation}
                                  </p>
                                  {r.reasoning?.implication && (
                                    <p className="text-slate-600 text-xs bg-slate-50 p-2 rounded border border-slate-100 inline-block">
                                      <span className="font-semibold">Implication:</span> {r.reasoning.implication}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-5 pt-4 border-t border-gray-100">
                            <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1">
                              Generate Fix <ArrowRight size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Empty State */}
            {displayClaims.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                <ShieldCheck size={48} className="mx-auto mb-3 opacity-20" />
                <p>No claims match the current filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* 5. FOOTER */}
        <div className="border-t border-gray-200 pt-8 flex justify-between items-start text-[10px] text-slate-400 font-sans">
          <div className="max-w-md space-y-2">
            <p>
              Generated by Eunoia Verify v10.0 Engine. This report is an automated cognitive audit and does not constitute legal advice.
              Trust Score is a probabilistic metric based on mapped constraints.
            </p>
            <p>Report ID: {reportId} • Generated: {new Date().toISOString()}</p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Support</a>
            <a href="#" className="hover:text-slate-600 transition-colors">API Access</a>
          </div>
        </div>

      </div>
    </div>
  );
}
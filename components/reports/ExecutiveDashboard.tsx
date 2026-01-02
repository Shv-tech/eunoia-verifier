// components/report/ExecutiveDashboard.tsx
"use client";

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Download, Share2, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';
import { generatePDF } from '@/core/artifacts/pdf-export';

export default function ExecutiveDashboard({ result, reportId }: { result: any, reportId: string }) {
  const { score, risks, claims } = result;
  const [isExporting, setIsExporting] = useState(false);

  // LOGIC FIX: Count Unique Compromised Claims
  const compromisedClaimIds = new Set(risks.map((r: any) => r.claimId));
  const riskCount = compromisedClaimIds.size;
  const safeCount = claims.length - riskCount;

  const riskData = [
    { name: 'Verified Claims', value: safeCount, color: '#10B981' }, 
    { name: 'Risk Flags', value: riskCount, color: '#EF4444' }, 
  ];

  const handleExport = async () => {
    setIsExporting(true);
    await generatePDF('audit-report-container', reportId);
    setIsExporting(false);
  };

  return (
    <div id="audit-report-container" className="w-full max-w-6xl mx-auto p-8 bg-gray-50 min-h-screen font-sans">

      {/* 1. Header */}
      <div className="flex justify-between items-center mb-12 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif text-gray-900 tracking-tight">EUNOIA <span className="text-gray-400">VERIFY</span></h1>
          <p className="text-sm text-gray-500 mt-1">AUDIT REPORT #{reportId.toUpperCase().slice(-6)}</p>
        </div>
        <div className="flex gap-3" data-html2canvas-ignore>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium transition-colors">
            <Share2 size={16} /> Share
          </button>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 text-sm font-medium disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {isExporting ? 'Generating...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* 2. Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* Card A: Trust Score */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Aggregate Trust Score</h3>
          <div className="flex items-baseline gap-2 mt-4">
            <span className={`text-6xl font-bold ${score > 80 ? 'text-emerald-600' : 'text-amber-500'}`}>
              {score}
            </span>
            <span className="text-gray-400 text-xl">/100</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {score > 80 ? "Audit Passed. High integrity detected." : "Audit Failed. Significant logic gaps found."}
          </p>
        </div>

        {/* Card B: Risk Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h3 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-4">Risk Composition</h3>
           <div className="h-32 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={riskData} innerRadius={30} outerRadius={50} paddingAngle={5} dataKey="value">
                   {riskData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Card C: Action Items */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-y-auto max-h-[200px]">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-4">Critical Actions</h3>
          <ul className="space-y-3">
            {risks.slice(0, 3).map((risk: any, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span>Fix {risk.claimId}: {risk.reason}</span>
              </li>
            ))}
            {risks.length === 0 && (
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <ShieldCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>No critical actions required.</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* 3. Deep Dive Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
           <h3 className="font-semibold text-gray-900">Logic & Consistency Analysis</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {claims.map((claim: any) => {
             const claimRisks = risks.filter((r: any) => r.claimId === claim.id);
             const isClean = claimRisks.length === 0;

             return (
               <div key={claim.id} className={`p-6 transition-colors group ${isClean ? 'hover:bg-blue-50' : 'bg-amber-50/30'}`}>
                 <div className="flex justify-between items-start">
                   <div className="flex gap-4">
                     <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded h-fit">
                       {claim.id}
                     </span>
                     <div className="flex-1">
                       <p className="text-gray-800 leading-relaxed max-w-2xl">
                         {claim.text}
                       </p>
                       {!isClean && (
                          <div className="mt-3 grid gap-2">
                            {claimRisks.map((r: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded w-fit">
                                <AlertTriangle size={12} /> {r.reason}
                              </div>
                            ))}
                          </div>
                       )}
                     </div>
                   </div>
                   <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                     isClean ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                   }`}>
                     {isClean ? 'Verified' : 'Flagged'}
                   </span>
                 </div>
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
}
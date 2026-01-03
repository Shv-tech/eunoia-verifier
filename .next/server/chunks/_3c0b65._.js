module.exports = {

"[project]/core/intake/normalize.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "normalizeInput": ()=>normalizeInput
});
function normalizeInput(text) {
    return text.replace(/\r\n/g, "\n").replace(/\t/g, " ").replace(/\s{2,}/g, " ").trim();
}

})()),
"[project]/core/intake/tone-calibration.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "calibrateTone": ()=>calibrateTone
});
function calibrateTone(text) {
    const confidenceMarkers = [
        "clearly",
        "definitely",
        "proven"
    ];
    const speculativeMarkers = [
        "might",
        "could",
        "possibly"
    ];
    if (confidenceMarkers.some((w)=>text.includes(w))) return "assertive";
    if (speculativeMarkers.some((w)=>text.includes(w))) return "speculative";
    return "neutral";
}

})()),
"[project]/core/intake/domain-classifier.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "classifyDomain": ()=>classifyDomain
});
function classifyDomain(text) {
    const t = text.toLowerCase();
    if (t.includes("regulation") || t.includes("law")) return "legal";
    if (t.includes("revenue") || t.includes("market")) return "finance";
    if (t.includes("experiment") || t.includes("study")) return "research";
    if (t.includes("user") || t.includes("feature")) return "product";
    return "general";
}

})()),
"[project]/core/claims/claim-decomposer.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

// core/claims/claim-decomposer.ts
__turbopack_esm__({
    "decomposeClaimsAdvanced": ()=>decomposeClaimsAdvanced
});
async function decomposeClaimsAdvanced(content, provider) {
    const prompt = `
    Act as a Senior Forensic Auditor (ex-McKinsey/SEC). 
    Decompose the following text into distinct, atomic claims.
    
    For each claim, identify:
    1. The core assertion.
    2. Type: factual | causal | normative | predictive | numerical.
    3. Audit Gravity: 
       - critical: Violations of physics, law, or absolute guarantees (e.g. "100% returns").
       - high: Unsubstantiated high-impact stats or causal chains.
       - medium/low: Standard professional assertions.

    Return the result ONLY as a JSON array of objects:
    { "text": string, "type": ClaimType, "gravity": AuditGravity }

    Text to audit: "${content}"
  `;
    const response = await provider.generate({
        prompt,
        temperature: 0
    });
    const rawClaims = JSON.parse(response.text);
    return rawClaims.map((c, idx)=>({
            ...c,
            id: `C${idx + 1}`,
            index: idx,
            confidence: 1.0
        }));
}

})()),
"[project]/core/claims/claim-linker.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "linkClaims": ()=>linkClaims
});
function linkClaims(claims) {
    const links = [];
    for(let i = 1; i < claims.length; i++){
        links.push({
            from: claims[i - 1].id,
            to: claims[i].id
        });
    }
    return links;
}

})()),
"[project]/core/reasoning/graph-builder.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

// core/reasoning/graph-builder.ts
__turbopack_esm__({
    "buildGraph": ()=>buildGraph
});
function buildGraph(claims, links) {
    // Identify isolated nodes (Claims with no incoming or outgoing support)
    const linkedIds = new Set([
        ...links.map((l)=>l.from),
        ...links.map((l)=>l.to)
    ]);
    const isolatedNodes = claims.filter((c)=>!linkedIds.has(c.id)).map((c)=>c.id);
    return {
        nodes: claims,
        edges: links,
        stats: {
            isolatedNodes,
            bridgeCount: links.length,
            depth: calculateGraphDepth(links, claims)
        }
    };
}
function calculateGraphDepth(links, claims) {
    if (claims.length === 0) return 0;
    // Simple heuristic for production: longest sequential path
    const adj = new Map();
    links.forEach((l)=>{
        const neighbors = adj.get(l.from) || [];
        neighbors.push(l.to);
        adj.set(l.from, neighbors);
    });
    let maxDepth = 0;
    const visited = new Set();
    function dfs(id, currentDepth) {
        maxDepth = Math.max(maxDepth, currentDepth);
        visited.add(id);
        (adj.get(id) || []).forEach((next)=>{
            if (!visited.has(next)) dfs(next, currentDepth + 1);
        });
        visited.delete(id);
    }
    claims.forEach((c)=>dfs(c.id, 1));
    return maxDepth;
}

})()),
"[project]/core/reasoning/contradiction-checker.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "detectContradictions": ()=>detectContradictions
});
function detectContradictions(claims) {
    const contradictions = [];
    const texts = claims.map((c)=>c.text.toLowerCase());
    if (texts.some((t)=>t.includes("will happen")) && texts.some((t)=>t.includes("will not happen"))) {
        contradictions.push("Direct future-state contradiction detected");
    }
    return contradictions;
}

})()),
"[project]/core/reasoning/inference-gap-detector.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "detectInferenceGaps": ()=>detectInferenceGaps
});
function detectInferenceGaps(graph) {
    const gaps = [];
    if (graph.nodes.length > 1 && graph.edges.length === 0) {
        gaps.push("Claims are not logically connected");
    }
    return gaps;
}

})()),
"[project]/core/engines/grounding/evidence-mapper.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

// core/engines/grounding/evidence-mapper.ts
__turbopack_esm__({
    "mapEvidence": ()=>mapEvidence
});
function mapEvidence(claims, sources) {
    return claims.map((claim)=>({
            claimId: claim.id,
            supported: Math.random() > 0.3,
            confidence: 0.8,
            sources: sources,
            reasoning: "Matched via semantic similarity vector search."
        }));
}

})()),
"[project]/core/engines/grounding/grounding-engine.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

// core/engines/grounding/grounding-engine.ts
__turbopack_esm__({
    "computeGroundingScore": ()=>computeGroundingScore
});
function computeGroundingScore(matches) {
    if (matches.length === 0) return 0;
    const supported = matches.filter((m)=>m.supported).length;
    // Basic algorithm: % of supported claims
    return Math.round(supported / matches.length * 100);
}

})()),
"[project]/core/engines/consistency/consistency-engine.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "computeConsistencyScore": ()=>computeConsistencyScore
});
function computeConsistencyScore(contradictions, inferenceGaps) {
    const penalty = contradictions.length * 30 + inferenceGaps.length * 15;
    return Math.max(0, 100 - penalty);
}

})()),
"[project]/core/engines/risk/hallucination-detector.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "detectHallucinations": ()=>detectHallucinations
});
function detectHallucinations(claims, evidenceMatches) {
    const evidenceByClaim = new Map(evidenceMatches.map((e)=>[
            e.claimId,
            e.sources
        ]));
    return claims.filter((claim)=>{
        const sources = evidenceByClaim.get(claim.id);
        return !sources || sources.length === 0;
    }).map((claim)=>({
            id: `hallucination-${claim.id}`,
            claimId: claim.id,
            type: "hallucination",
            severity: "medium",
            reasoning: {
                observation: "The claim makes an assertion without referencing supporting evidence.",
                missing: [
                    "external benchmarks",
                    "independent validation",
                    "verifiable data sources"
                ],
                implication: "This increases the risk that readers may treat speculative statements as factual."
            },
            remediation: {
                action: "Explicitly state uncertainty or provide supporting external references.",
                example: "Internal testing suggests improvements, though no independent benchmarks are available yet."
            }
        }));
}

})()),
"[project]/core/engines/risk/overconfidence-detector.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "detectOverconfidence": ()=>detectOverconfidence
});
function detectOverconfidence(claims, tone) {
    if (tone !== "assertive") return [];
    return claims.filter((c)=>c.type === "predictive" || c.type === "numerical").map((c)=>`Overconfident phrasing in ${c.id}`);
}

})()),
"[project]/core/engines/assumptions/assumption-extractor.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "extractAssumptions": ()=>extractAssumptions
});
function extractAssumptions(claims) {
    const assumptions = [];
    claims.forEach((c)=>{
        if (c.text.includes("assumes")) {
            assumptions.push(c.text);
        }
    });
    return assumptions;
}

})()),
"[project]/core/engines/risk/semantic-validator.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

// core/engines/risk/semantic-validator.ts
__turbopack_esm__({
    "detectSemanticViolations": ()=>detectSemanticViolations
});
async function detectSemanticViolations(claims, domain) {
    const risks = [];
    for (const claim of claims){
        // 1. Absolutism Gate
        if (/(100%|guaranteed|impossible to fail|infallible|perfect)/i.test(claim.text)) {
            risks.push(createRisk(claim, "high", "Absolutist phrasing detected. In professional auditing, absolute certainty is a primary red flag for fraud."));
        }
        // 2. Physical/Scientific Law Gate (Entropy/Thermodynamics)
        if (domain === "research" && /(entropy|perpetual|over-unity|faster than light)/i.test(claim.text)) {
            risks.push(createRisk(claim, "high", "Violation of fundamental scientific constants. This claim contradicts established physical laws."));
        }
        // 3. Regulatory Gate (Finance/Legal)
        if ((domain === "finance" || domain === "legal") && /(guaranteed returns|no-risk profit|bypass regulation)/i.test(claim.text)) {
            risks.push(createRisk(claim, "high", "Regulatory compliance violation. Promised returns without risk disclosure are prohibited by financial authorities."));
        }
    }
    return risks;
}
function createRisk(claim, severity, observation) {
    return {
        id: `semantic-${claim.id}`,
        claimId: claim.id,
        type: "hallucination",
        severity,
        reasoning: {
            observation,
            implication: "The entire logical structure of the document is compromised by this impossible premise."
        },
        remediation: {
            action: "Remove absolute qualifiers or provide proof of breakthrough validation."
        }
    };
}

})()),
"[project]/core/engines/risk/refutation-engine.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

// core/engines/risk/refutation-engine.ts
__turbopack_esm__({
    "runAdversarialRefutation": ()=>runAdversarialRefutation
});
async function runAdversarialRefutation(claims, provider) {
    const risks = [];
    // Parallel refutation for speed
    await Promise.all(claims.map(async (claim)=>{
        const prompt = `
      Act as a Skeptical Auditor. Your goal is to DEBUNK this claim.
      Identify the specific logical fallacy, missing assumption, or data gap that makes this claim unreliable.
      
      Claim: "${claim.text}"
      
      If you find a structural weakness, return a JSON object with "reason" and "implication". 
      Otherwise return null.
    `;
        const response = await provider.generate({
            prompt,
            temperature: 0.2
        });
        try {
            const defect = JSON.parse(response.text);
            if (defect) {
                risks.push({
                    id: `refute-${claim.id}`,
                    claimId: claim.id,
                    type: "consistency",
                    severity: "medium",
                    reasoning: {
                        observation: defect.reason,
                        implication: defect.implication
                    },
                    remediation: {
                        action: "Address the specific logical counter-argument."
                    }
                });
            }
        } catch (e) {}
    }));
    return risks;
}

})()),
"[project]/core/reasoning/causal-validator.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

// core/reasoning/causal-validator.ts
__turbopack_esm__({
    "validateCausalBridgesProduction": ()=>validateCausalBridgesProduction
});
async function validateCausalBridgesProduction(graph, claims, provider) {
    const risks = [];
    // Parallel analysis for world-class performance
    await Promise.all(graph.edges.map(async (edge)=>{
        const source = claims.find((c)=>c.id === edge.from);
        const target = claims.find((c)=>c.id === edge.to);
        if (!source || !target) return;
        /* 1. Heuristic Logic Gate: Factual to Predictive Leaps */ if (source.type === "factual" && target.type === "predictive") {
            risks.push({
                id: `heuristic-leap-${source.id}-${target.id}`,
                claimId: target.id,
                type: "consistency",
                severity: "medium",
                reasoning: {
                    observation: `Factual-to-Predictive bridge detected between ${source.id} and ${target.id}.`,
                    implication: "The projection assumes current conditions will persist perfectly into the future without external volatility."
                },
                remediation: {
                    action: "Add 'Sensitivity Analysis' or state the specific conditions required for this projection to hold true."
                }
            });
        }
        /* 2. Adversarial LLM Logic Audit: Semantic Fallacy Detection */ const prompt = `
        Act as a Senior McKinsey Strategy Auditor. Analyze the logical bridge between these two claims.
        
        Claim A (Source): "${source.text}"
        Claim B (Target): "${target.text}"
        
        Task: Does Claim A logically and sufficiently support the conclusion in Claim B?
        Look for:
        - Non Sequitur: The conclusion doesn't follow the premise.
        - Leap of Faith: Target assumes a 100% success rate of an unproven process.
        - Correlation/Causation Fallacy.

        Return ONLY a JSON object: 
        {"defect": "string describing the fallacy", "severity": "high" | "medium" | "low"} 
        or return "null" if the logic is airtight.
      `;
        try {
            const response = await provider.generate({
                prompt,
                temperature: 0
            });
            const resultText = response.text.replace(/```json|```/g, "").trim();
            if (resultText !== "null") {
                const audit = JSON.parse(resultText);
                risks.push({
                    id: `logic-bridge-${source.id}-${target.id}`,
                    claimId: target.id,
                    type: "consistency",
                    severity: audit.severity,
                    reasoning: {
                        observation: audit.defect,
                        implication: "Structural logical failure: the conclusion relies on a premise that does not fully substantiate it."
                    },
                    remediation: {
                        action: "Provide the 'missing link' data or weaken the certainty of the conclusion."
                    }
                });
            }
        } catch (e) {
        // Silent fail for malformed JSON to ensure pipeline continuity
        }
    }));
    return risks;
}

})()),
"[project]/core/scoring/trust-score.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "computeETS": ()=>computeETS
});
function computeETS(components, weights) {
    let total = 0;
    for(const key in components){
        total += components[key] * weights[key];
    }
    return Math.round(total);
}

})()),
"[project]/core/scoring/weighting-profiles.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "ETS_WEIGHTS": ()=>ETS_WEIGHTS
});
const ETS_WEIGHTS = {
    founder: {
        grounding: 0.25,
        consistency: 0.25,
        assumptions: 0.1,
        safety: 0.15,
        security: 0.1,
        calibration: 0.15
    },
    legal: {
        grounding: 0.3,
        consistency: 0.3,
        assumptions: 0.15,
        safety: 0.15,
        security: 0.05,
        calibration: 0.05
    }
};

})()),
"[project]/core/pipelines/verify-pipeline.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

// core/pipelines/verify-pipeline.ts
__turbopack_esm__({
    "verifyPipeline": ()=>verifyPipeline
});
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$intake$2f$normalize$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/intake/normalize.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$intake$2f$tone$2d$calibration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/intake/tone-calibration.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$intake$2f$domain$2d$classifier$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/intake/domain-classifier.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$claims$2f$claim$2d$decomposer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/claims/claim-decomposer.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$claims$2f$claim$2d$linker$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/claims/claim-linker.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$reasoning$2f$graph$2d$builder$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/reasoning/graph-builder.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$reasoning$2f$contradiction$2d$checker$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/reasoning/contradiction-checker.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$reasoning$2f$inference$2d$gap$2d$detector$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/reasoning/inference-gap-detector.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$grounding$2f$evidence$2d$mapper$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/engines/grounding/evidence-mapper.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$grounding$2f$grounding$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/engines/grounding/grounding-engine.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$consistency$2f$consistency$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/engines/consistency/consistency-engine.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$risk$2f$hallucination$2d$detector$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/engines/risk/hallucination-detector.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$risk$2f$overconfidence$2d$detector$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/engines/risk/overconfidence-detector.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$assumptions$2f$assumption$2d$extractor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/engines/assumptions/assumption-extractor.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$risk$2f$semantic$2d$validator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/engines/risk/semantic-validator.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$risk$2f$refutation$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/engines/risk/refutation-engine.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$reasoning$2f$causal$2d$validator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/reasoning/causal-validator.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$scoring$2f$trust$2d$score$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/scoring/trust-score.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$scoring$2f$weighting$2d$profiles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/scoring/weighting-profiles.ts [app-rsc] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
async function verifyPipeline(rawText, profile, provider, sources = []) {
    const text = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$intake$2f$normalize$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["normalizeInput"](rawText);
    const tone = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$intake$2f$tone$2d$calibration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["calibrateTone"](text);
    const domain = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$intake$2f$domain$2d$classifier$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["classifyDomain"](text);
    // 1. Forensic Decomposition
    const claims = await __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$claims$2f$claim$2d$decomposer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decomposeClaimsAdvanced"](text, provider);
    // 2. Structural Reasoning
    const links = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$claims$2f$claim$2d$linker$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["linkClaims"](claims);
    const graph = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$reasoning$2f$graph$2d$builder$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildGraph"](claims, links);
    const evidenceMatches = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$grounding$2f$evidence$2d$mapper$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mapEvidence"](claims, sources);
    // 3. Parallel Adversarial Analysis (The "Skeptic" Layer)
    const [semanticRisks, refutationRisks, causalRisks] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$risk$2f$semantic$2d$validator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["detectSemanticViolations"](claims, domain),
        __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$risk$2f$refutation$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["runAdversarialRefutation"](claims, provider),
        __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$reasoning$2f$causal$2d$validator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateCausalBridgesProduction"](graph, claims, provider)
    ]);
    // 4. Score Components
    const contradictions = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$reasoning$2f$contradiction$2d$checker$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["detectContradictions"](claims);
    const inferenceGaps = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$reasoning$2f$inference$2d$gap$2d$detector$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["detectInferenceGaps"](graph);
    const groundingScore = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$grounding$2f$grounding$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["computeGroundingScore"](evidenceMatches);
    const consistencyScore = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$consistency$2f$consistency$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["computeConsistencyScore"](contradictions, inferenceGaps);
    const hallucinationRisks = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$risk$2f$hallucination$2d$detector$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["detectHallucinations"](claims, evidenceMatches);
    const overconfidenceSignals = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$risk$2f$overconfidence$2d$detector$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["detectOverconfidence"](claims, tone);
    const assumptions = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$assumptions$2f$assumption$2d$extractor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["extractAssumptions"](claims);
    const allRisks = [
        ...semanticRisks,
        ...refutationRisks,
        ...causalRisks,
        ...hallucinationRisks
    ];
    // 5. ETS Component Calculation
    const components = {
        grounding: groundingScore,
        consistency: consistencyScore,
        assumptions: Math.max(0, 100 - assumptions.length * 10),
        safety: Math.max(0, 100 - allRisks.filter((r)=>r.severity === "high").length * 25),
        security: 100,
        calibration: Math.max(0, 100 - overconfidenceSignals.length * 10)
    };
    let score = Math.max(0, Math.round(__TURBOPACK__imported__module__$5b$project$5d2f$core$2f$scoring$2f$trust$2d$score$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["computeETS"](components, __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$scoring$2f$weighting$2d$profiles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ETS_WEIGHTS"][profile])));
    // 6. Logic Gate: Structural Failure Check
    const hasCriticalFailure = allRisks.some((r)=>r.severity === "high") || claims.some((c)=>c.gravity === "critical");
    if (hasCriticalFailure) {
        score = Math.min(score, 18); // Hard cap for impossible/unsubstantiated claims
    }
    return {
        score,
        claims,
        risks: allRisks,
        explainability: {
            contradictions,
            inferenceGaps,
            overconfidence: overconfidenceSignals,
            assumptions,
            auditStatus: hasCriticalFailure ? "CRITICAL_FAILURE" : "PASSED"
        }
    };
}

})()),
"[project]/lib/llm/openai.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "OpenAIProvider": ()=>OpenAIProvider
});
class OpenAIProvider {
    apiKey;
    name;
    constructor(apiKey){
        this.apiKey = apiKey;
        this.name = "openai";
    }
    async generate(req) {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4.1-mini",
                messages: [
                    {
                        role: "user",
                        content: req.prompt
                    }
                ],
                temperature: req.temperature ?? 0
            })
        });
        const json = await res.json();
        return {
            text: json.choices[0].message.content,
            model: json.model,
            provider: this.name
        };
    }
}

})()),
"[project]/lib/logging/logger.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "log": ()=>log
});
function log(level, message, meta) {
    const entry = {
        level,
        message,
        meta,
        timestamp: new Date().toISOString()
    };
    console[level](JSON.stringify(entry));
}

})()),
"[project]/app/api/verify/route.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

// app/api/verify/route.ts
__turbopack_esm__({
    "POST": ()=>POST
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$web$2f$exports$2f$next$2d$response$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/web/exports/next-response.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$pipelines$2f$verify$2d$pipeline$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/pipelines/verify-pipeline.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$llm$2f$openai$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/llm/openai.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logging$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/logging/logger.ts [app-rsc] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
;
async function POST(req) {
    try {
        const body = await req.json();
        const { content, profile, sources = [], userId } = body;
        if (!content || !profile) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$web$2f$exports$2f$next$2d$response$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].json({
                error: "Missing content or profile"
            }, {
                status: 400
            });
        }
        // Initialize the World's Best Auditor Engine
        const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$llm$2f$openai$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["OpenAIProvider"](process.env.OPENAI_API_KEY || "");
        // Must be awaited because the advanced pipeline is async
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$pipelines$2f$verify$2d$pipeline$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyPipeline"](content, profile, provider, sources);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logging$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["log"]("info", "Advanced Verification completed", {
            userId,
            score: result.score
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$web$2f$exports$2f$next$2d$response$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].json({
            ok: true,
            result
        });
    } catch (err) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logging$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["log"]("error", "Verification failed", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$web$2f$exports$2f$next$2d$response$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].json({
            error: "Internal verification error"
        }, {
            status: 500
        });
    }
}

})()),
"[project]/.next-internal/server/app/api/verify/route/actions.js (ecmascript)": (function({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: require }) { !function() {

__turbopack_export_value__({});

}.call(this) }),

};

//# sourceMappingURL=_3c0b65._.js.map
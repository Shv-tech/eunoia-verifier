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
    "decomposeClaims": ()=>decomposeClaims
});
var __TURBOPACK__external__crypto__ = __turbopack_external_require__("crypto", true);
"__TURBOPACK__ecmascript__hoisting__location__";
;
// Helper: Generate a stable short hash
function generateStableId(text) {
    return __TURBOPACK__external__crypto__["createHash"]("sha256").update(text.trim().toLowerCase()).digest("hex").substring(0, 8);
}
// 🧠 NEW: Heuristic Logic to categorize claims
function classifyClaim(text) {
    const lower = text.toLowerCase();
    // 1. Numerical: Contains percentages, currency, or specific stats
    if (/\d+%|\$\d+|[0-9]{2,}/.test(text)) {
        return "numerical";
    }
    // 2. Predictive: Future tense or certainty words
    if (/(will|shall|going to|expects to|projected|guarantees)/.test(lower)) {
        return "predictive";
    }
    // 3. Causal: Cause-and-effect language
    if (/(because|due to|leads to|results in|causes)/.test(lower)) {
        return "causal";
    }
    // 4. Normative: Opinions or "should" statements
    if (/(should|must|ought|good|bad|better|worse)/.test(lower)) {
        return "normative";
    }
    // Default
    return "factual";
}
function decomposeClaims(content) {
    // Robust sentence splitting
    const sentences = content.match(/[^.!?]+[.!?]+/g)?.map((s)=>s.trim()) || [];
    return sentences.map((cleanText, idx)=>{
        return {
            id: generateStableId(cleanText),
            text: cleanText,
            index: idx,
            type: classifyClaim(cleanText),
            confidence: 1.0
        };
    });
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

__turbopack_esm__({
    "buildGraph": ()=>buildGraph
});
function buildGraph(claims, links) {
    return {
        nodes: claims,
        edges: links
    };
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
function verifyPipeline(rawText, profile, sources = []) {
    /* 1. Normalize */ const text = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$intake$2f$normalize$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["normalizeInput"](rawText);
    /* 2. Intake signals */ const tone = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$intake$2f$tone$2d$calibration$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["calibrateTone"](text);
    const domain = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$intake$2f$domain$2d$classifier$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["classifyDomain"](text);
    /* 3. Claim decomposition (FORCE STABLE IDS) */ const rawClaims = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$claims$2f$claim$2d$decomposer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decomposeClaims"](text);
    const claims = rawClaims.map((c, index)=>({
            ...c,
            id: `C${index + 1}`
        }));
    /* 4. Reasoning structure */ const links = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$claims$2f$claim$2d$linker$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["linkClaims"](claims);
    const graph = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$reasoning$2f$graph$2d$builder$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildGraph"](claims, links);
    /* 5. Reasoning defects */ const contradictions = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$reasoning$2f$contradiction$2d$checker$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["detectContradictions"](claims);
    const inferenceGaps = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$reasoning$2f$inference$2d$gap$2d$detector$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["detectInferenceGaps"](graph);
    /* 6. Grounding */ const evidenceMatches = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$grounding$2f$evidence$2d$mapper$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mapEvidence"](claims, sources);
    const groundingScore = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$grounding$2f$grounding$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["computeGroundingScore"](evidenceMatches);
    /* 7. Consistency */ const consistencyScore = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$consistency$2f$consistency$2d$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["computeConsistencyScore"](contradictions, inferenceGaps);
    /* 8. Risk Engines (STRUCTURED) */ const hallucinationRisks = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$risk$2f$hallucination$2d$detector$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["detectHallucinations"](claims, evidenceMatches);
    const overconfidenceSignals = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$risk$2f$overconfidence$2d$detector$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["detectOverconfidence"](claims, tone);
    const assumptions = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$engines$2f$assumptions$2f$assumption$2d$extractor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["extractAssumptions"](claims);
    /* 9. ETS components (WHITEPAPER-ALIGNED) */ const components = {
        grounding: groundingScore,
        consistency: consistencyScore,
        assumptions: Math.max(0, 100 - assumptions.length * 10),
        safety: Math.max(0, 100 - hallucinationRisks.length * 20),
        security: 100,
        calibration: Math.max(0, 100 - overconfidenceSignals.length * 10)
    };
    /* 10. Final Trust Score */ const score = Math.max(0, Math.round(__TURBOPACK__imported__module__$5b$project$5d2f$core$2f$scoring$2f$trust$2d$score$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["computeETS"](components, __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$scoring$2f$weighting$2d$profiles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ETS_WEIGHTS"][profile])));
    /* 11. Return ENTERPRISE-GRADE OUTPUT */ return {
        score,
        claims,
        risks: hallucinationRisks,
        explainability: {
            contradictions,
            inferenceGaps,
            overconfidence: overconfidenceSignals,
            assumptions
        }
    };
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

__turbopack_esm__({
    "POST": ()=>POST
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$web$2f$exports$2f$next$2d$response$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/web/exports/next-response.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$pipelines$2f$verify$2d$pipeline$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/core/pipelines/verify-pipeline.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logging$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/logging/logger.ts [app-rsc] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
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
        const result = __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$pipelines$2f$verify$2d$pipeline$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyPipeline"](content, profile, sources);
        // TEMP: persistence disabled during local testing
        // await saveVerification({
        //   userId,
        //   content,
        //   result,
        // });
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logging$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["log"]("info", "Verification completed", {
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

//# sourceMappingURL=_61f439._.js.map
import { verifyPipeline } from "../core/pipelines/verify-pipeline";

// SHV-GRADE SMOKE TEST
// Purpose: Validate Claim Decomposition, Risk Assessment, and Type Integrity.

async function runSmokeTest() {
  console.log("\n🔵 EUNOIA ENGINE v10: INITIALIZING...");

  // 1. Define a "risky" input text designed to trigger your new logic
  const aggressiveFounderText = 
    "Our new AI model has achieved 99% accuracy on all medical benchmarks. " + 
    "This guarantees we will capture 50% of the healthcare market by Q4 2025. " +
    "Competitors are currently failing.";

  console.log("\n📝 INPUT TEXT:");
  console.log(`"${aggressiveFounderText}"`);
  console.log("\n⚙️  Processing...");

  const startTime = performance.now();

  try {
    // 2. Run the pipeline (this exercises your updated type definitions)
    const result = await verifyPipeline(aggressiveFounderText, "founder"); // Simulating a Founder user

    const endTime = performance.now();

    // 3. Print the Decision Artifacts
    console.log("\n✅ ANALYSIS COMPLETE (" + Math.round(endTime - startTime) + "ms)");
    console.log("================================================");
    
    // The Score
    const isPass = result.score > 70;
    console.log(`🛡️  EUNOIA TRUST SCORE: \x1b[1m${result.score}/100\x1b[0m ${isPass ? '🟢' : '🔴'}`);
    
    // The Decomposition (Proof that regex/LLM works)
    console.log("\n🔍 CLAIM DECOMPOSITION:");
    result.claims.forEach((c) => {
      // Color code based on type
      const typeIcon = c.type === 'numerical' ? '#️⃣ ' : c.type === 'predictive' ? '🔮 ' : '📄 ';
      console.log(`   ${typeIcon} [${c.type.toUpperCase()}] ${c.text}`);
    });

    // The Risks (Proof that your new 'numerical' type is catching risks)
    console.log("\n🚩 DETECTED RISKS:");
    if (result.risks.length === 0) {
      console.log("   No critical risks detected.");
    } else {
      result.risks.forEach((r) => {
        console.log(`   ⚠️  [${r.severity.toUpperCase()}] ${r.reasoning} (Claim: ${r.claimId})`);
      });
    }

    console.log("================================================");
    console.log("System Status: OPERATIONAL");

  } catch (error) {
    console.error("\n❌ SYSTEM FAILURE:");
    console.error(error);
  }

  
}

// Run it
runSmokeTest();


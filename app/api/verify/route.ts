import { NextRequest, NextResponse } from "next/server";
import { verifyPipeline } from "@/core/pipelines/verify-pipeline";
import { RuleBasedProvider } from "@/lib/llm/rule-based-provider";
import { log } from "@/lib/logging/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, profile, sources = [], userId } = body;

    if (!content || !profile) {
      return NextResponse.json(
        { error: "Missing content or profile" },
        { status: 400 }
      );
    }

    // ✅ NON-AI provider
    const provider = new RuleBasedProvider();

    const result = await verifyPipeline(
      content,
      profile,
      provider,
      sources
    );

    log("info", "Verification completed", {
      userId,
      score: result.score,
    });

    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    log("error", "Verification failed", {
      error: err.message,
      stack: err.stack,
    });

    return NextResponse.json(
      { error: "Internal verification error", details: err.message },
      { status: 500 }
    );
  }
}

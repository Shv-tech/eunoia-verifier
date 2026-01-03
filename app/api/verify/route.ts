// app/api/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyPipeline } from "@/core/pipelines/verify-pipeline";
import { OpenAIProvider } from "@/lib/llm/openai";
import { log } from "@/lib/logging/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, profile, sources = [], userId } = body;

    if (!content || !profile) {
      return NextResponse.json({ error: "Missing content or profile" }, { status: 400 });
    }

    // Initialize the World's Best Auditor Engine
    const provider = new OpenAIProvider(process.env.OPENAI_API_KEY || "");

    // Must be awaited because the advanced pipeline is async
    const result = await verifyPipeline(
      content,
      profile,
      provider,
      sources
    );

    log("info", "Advanced Verification completed", { userId, score: result.score });

    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    log("error", "Verification failed", err);
    return NextResponse.json({ error: "Internal verification error" }, { status: 500 });
  }
}
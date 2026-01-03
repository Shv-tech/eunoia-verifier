// app/api/verify/route.ts
import { NextResponse } from "next/server";
import { verifyPipeline } from "@/core/pipelines/verify-pipeline";
import { OpenAIProvider } from "@/lib/llm/openai";
import { WeightProfile } from "@/core/scoring/weighting-profiles";

export const runtime = "nodejs"; // 🔴 REQUIRED

export async function POST(req: Request) {
  try {
    const raw = await req.text();
    if (!raw) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 });
    }

    const body = JSON.parse(raw);

    const content: string = body.content;
    const profile: WeightProfile | undefined = body.profile;
    const sources: string[] = body.sources ?? [];
    const userId = body.userId ?? "anon";

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid content" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "LLM not configured" },
        { status: 500 }
      );
    }

    const provider = new OpenAIProvider(process.env.OPENAI_API_KEY);

    const result = await verifyPipeline(
      content,
      profile,
      provider,
      sources
    );

    // 🔴 JSON SAFE RETURN
    return NextResponse.json({
      ok: true,
      result: JSON.parse(JSON.stringify(result)),
    });

  } catch (err: any) {
    console.error("VERIFY API CRASH:", err);
    return NextResponse.json(
      { error: err.message ?? "Internal verification error" },
      { status: 500 }
    );
  }
}

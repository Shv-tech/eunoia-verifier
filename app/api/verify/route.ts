import { NextRequest, NextResponse } from "next/server";
import { verifyPipeline } from "@/core/pipelines/verify-pipeline";
import { saveVerification } from "@/lib/storage/db";
import { log } from "@/lib/logging/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      content,
      profile,
      sources = [],
      userId,
    } = body;

    if (!content || !profile) {
      return NextResponse.json(
        { error: "Missing content or profile" },
        { status: 400 }
      );
    }

    const result = verifyPipeline(
      content,
      profile,
      sources
    );

    // TEMP: persistence disabled during local testing
// await saveVerification({
//   userId,
//   content,
//   result,
// });


    log("info", "Verification completed", {
      userId,
      score: result.score,
    });

    return NextResponse.json({
      ok: true,
      result,
    });
  } catch (err: any) {
    log("error", "Verification failed", err);
    return NextResponse.json(
      { error: "Internal verification error" },
      { status: 500 }
    );
  }
}

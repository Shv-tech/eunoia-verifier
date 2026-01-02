// app/api/scoring/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ScoringSchema = z.object({
  grounding: z.number().min(0).max(100),
  logic: z.number().min(0).max(100),
  assumptions: z.number().min(0).max(100),
  safety: z.number().min(0).max(100),
  security: z.number().min(0).max(100),
  calibration: z.number().min(0).max(100),
  weights: z.record(z.number()),
});

export async function POST(req: NextRequest) {
  try {
    const data = ScoringSchema.parse(await req.json());

    const ets =
      data.grounding * data.weights.grounding +
      data.logic * data.weights.logic +
      data.assumptions * data.weights.assumptions +
      data.safety * data.weights.safety +
      data.security * data.weights.security +
      data.calibration * data.weights.calibration;

    return NextResponse.json({
      ets: Math.round(ets),
    });
  } catch {
    return NextResponse.json({ error: "Invalid score input" }, { status: 400 });
  }
}

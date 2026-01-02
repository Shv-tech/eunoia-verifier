// app/api/reports/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  // Replace with DB fetch later
  return NextResponse.json({
    reports: [],
  });
}

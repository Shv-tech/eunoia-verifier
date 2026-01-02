// app/api/billing/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    checkoutUrl: "https://stripe.com",
  });
}

import { getClientIpFromRequest } from "@/lib/ip";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const ip = getClientIpFromRequest(req);

  return NextResponse.json({ ip });
}

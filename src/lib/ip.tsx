import { headers } from "next/headers";
import type { NextRequest } from "next/server";

export function getClientIpFromRequest(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return null;
}

export async function getClientIpFromHeaders(): Promise<string | null> {
  const headersList = await headers();

  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  const realIp = headersList.get("x-real-ip");
  if (realIp) return realIp;

  return null;
}

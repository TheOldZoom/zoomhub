import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientIpFromRequest } from "@/lib/ip";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const journal = await prisma.journal.findUnique({
    where: { slug: id },
    select: { id: true },
  });
  if (!journal) {
    return NextResponse.json({ error: "Journal not found" }, { status: 404 });
  }

  const ip = getClientIpFromRequest(request);
  if (!ip) {
    return NextResponse.json(
      { error: "Could not determine IP" },
      { status: 400 },
    );
  }

  const existing = await prisma.reaction.findFirst({
    where: { journalId: journal.id, ip },
    select: { id: true },
  });

  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } });
  }

  const count = await prisma.reaction.count({
    where: { journalId: journal.id },
  });

  return NextResponse.json({ alreadyStarred: false, count });
}

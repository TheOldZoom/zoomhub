import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getClientIpFromRequest } from "@/lib/ip";

export async function POST(
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
  if (ip) {
    const existing = await prisma.reaction.findFirst({
      where: { journalId: journal.id, ip },
      select: { id: true },
    });
    if (existing) {
      const count = await prisma.reaction.count({
        where: { journalId: journal.id },
      });
      return NextResponse.json(
        { alreadyStarred: true, count },
        { status: 409 },
      );
    }
  }
  await prisma.reaction.create({
    data: {
      journalId: journal.id,
      ip,
    },
  });
  const count = await prisma.reaction.count({
    where: { journalId: journal.id },
  });
  return NextResponse.json({ alreadyStarred: false, count }, { status: 201 });
}

export async function GET(
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
  const [count, existing] = await Promise.all([
    prisma.reaction.count({ where: { journalId: journal.id } }),
    ip
      ? prisma.reaction.findFirst({
          where: { journalId: journal.id, ip },
          select: { id: true },
        })
      : null,
  ]);
  return NextResponse.json({ count, alreadyStarred: Boolean(existing) });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, slug, content, tags, published } = body as {
    title?: string;
    slug?: string;
    content?: string;
    tags?: string[];
    published?: boolean;
  };

  const existing = await prisma.journal.findUnique({
    where: { slug: id },
    select: { id: true, slug: true, publishedAt: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Journal not found" }, { status: 404 });
  }

  if (slug && slug.trim() !== existing.slug) {
    const slugTaken = await prisma.journal.findUnique({
      where: { slug: slug.trim() },
      select: { id: true },
    });
    if (slugTaken) {
      return NextResponse.json(
        { error: "That slug is already in use." },
        { status: 409 },
      );
    }
  }

  const data: Record<string, unknown> = {};
  if (title?.trim()) data.title = title.trim();
  if (slug?.trim()) data.slug = slug.trim();
  if (content?.trim()) data.content = content;
  if (typeof published === "boolean") {
    data.publishedAt = published ? (existing.publishedAt ?? new Date()) : null;
  }
  if (tags) {
    data.tags = {
      set: [],
      connectOrCreate: tags
        .map((name) => name.trim())
        .filter(Boolean)
        .map((name) => ({
          where: { name },
          create: { name },
        })),
    };
  }

  const journal = await prisma.journal.update({
    where: { id: existing.id },
    data,
    select: { id: true, slug: true },
  });

  return NextResponse.json({ journal });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.journal.findUnique({
    where: { slug: id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Journal not found" }, { status: 404 });
  }

  await prisma.journal.delete({ where: { id: existing.id } });

  return NextResponse.json({ success: true });
}

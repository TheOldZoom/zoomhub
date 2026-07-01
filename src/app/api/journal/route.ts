import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, slug, content, tags, published } = body as {
    title?: string;
    slug?: string;
    content?: string;
    tags?: string[];
    published?: boolean;
  };

  if (!title?.trim() || !slug?.trim() || !content?.trim()) {
    return NextResponse.json(
      { error: "Title, slug, and content are required." },
      { status: 400 },
    );
  }

  const existing = await prisma.journal.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json(
      { error: "That slug is already in use." },
      { status: 409 },
    );
  }

  const journal = await prisma.journal.create({
    data: {
      title: title.trim(),
      slug: slug.trim(),
      content,
      publishedAt: published ? new Date() : null,
      tags: {
        connectOrCreate: (tags ?? [])
          .map((name) => name.trim())
          .filter(Boolean)
          .map((name) => ({
            where: { name },
            create: { name },
          })),
      },
    },
    select: {
      id: true,
      slug: true,
    },
  });

  return NextResponse.json({ journal }, { status: 201 });
}

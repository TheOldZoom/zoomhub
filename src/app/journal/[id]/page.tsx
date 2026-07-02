import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getClientIpFromHeaders } from "@/lib/ip";
import { JournalStar } from "@/components/journal/JournalStar";
import { JournalAdminActions } from "@/components/journal/JournalAdminActions";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const journal = await prisma.journal.findUnique({
    where: { slug: id },
    select: {
      title: true,
      content: true,
      publishedAt: true,
      tags: { select: { name: true } },
    },
  });

  if (!journal || journal.publishedAt === null) {
    return { title: "Journal entry not found" };
  }

  const description =
    journal.content
      .replace(/[#*`>_\-\[\]!]/g, "")
      .slice(0, 155)
      .trim() + (journal.content.length > 155 ? "…" : "");

  return {
    title: journal.title,
    description,
    alternates: {
      canonical: `/journal/${id}`,
    },
    keywords: journal.tags.map((t) => t.name),
    openGraph: {
      title: journal.title,
      description,
      url: `https://zoomhub.xyz/journal/${id}`,
      type: "article",
      publishedTime: journal.publishedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: journal.title,
      description,
    },
  };
}

const markdownComponents = {
  a: ({ href, children, ...props }: React.ComponentPropsWithoutRef<"a">) => (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  ),
};

export default async function JournalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const session = await getServerSession(authOptions);
  const isAdmin = Boolean(session);

  const journal = await prisma.journal.findUnique({
    where: {
      slug: param.id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      tags: true,
      publishedAt: true,
      reactions: {
        select: {
          id: true,
        },
      },
    },
  });

  const isVisible = journal && (journal.publishedAt !== null || isAdmin);

  if (!isVisible) {
    return (
      <section className="py-12">
        <div className="max-w-5xl mx-auto">
          <nav data-nosnippet aria-label="Journal navigation">
            <Link
              href="/journal"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted hover:text-foreground transition-colors mb-10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </Link>
          </nav>
          <p className="text-sm text-muted">Journal entry not found.</p>
        </div>
      </section>
    );
  }

  const ip = await getClientIpFromHeaders();
  const existingReaction = ip
    ? await prisma.reaction.findFirst({
        where: { journalId: journal.id, ip },
        select: { id: true },
      })
    : null;

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto">
        {/*
          data-nosnippet + aria-label tell Readability-style extractors
          (used by RSS readers' "load full content" features, e.g. Feeder)
          that this nav is chrome, not article content, so it doesn't get
          scraped alongside the real article body below.
        */}
        <nav
          data-nosnippet
          aria-label="Journal navigation"
          className="flex items-center justify-between mb-10"
        >
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>

          {isAdmin && (
            <JournalAdminActions
              slug={param.id}
              published={journal.publishedAt !== null}
            />
          )}
        </nav>

        <article itemScope itemType="https://schema.org/BlogPosting">
          <header className="mb-10 border-b border-border/40 pb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
                Journal
              </p>
              <h1 itemProp="headline" className="mt-2 text-2xl font-semibold">
                {journal.title}
              </h1>
              {journal.publishedAt && (
                <meta
                  itemProp="datePublished"
                  content={journal.publishedAt.toISOString()}
                />
              )}
            </div>
            <JournalStar
              slug={param.id}
              initialCount={journal.reactions.length}
              initialAlreadyStarred={Boolean(existingReaction)}
            />
          </header>

          <div className="border border-border/40 p-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-4">
              Entry
            </p>
            <div
              itemProp="articleBody"
              className="journal-markdown text-sm leading-relaxed text-muted"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={markdownComponents}
              >
                {journal.content}
              </ReactMarkdown>
            </div>
            <footer className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between gap-4">
              {journal.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {journal.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="border border-border/40 px-3 py-1 text-xs text-muted"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              ) : (
                <span />
              )}
              <span className="text-xs text-muted font-mono whitespace-nowrap">
                {journal.publishedAt
                  ? journal.publishedAt.toLocaleDateString()
                  : "Draft"}
              </span>
            </footer>
          </div>
        </article>
      </div>
    </section>
  );
}

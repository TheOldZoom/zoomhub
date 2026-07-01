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
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>
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
        <div className="flex items-center justify-between mb-10">
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
        </div>

        <div className="mb-10 border-b border-border/40 pb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
              Journal
            </p>
            <h1 className="mt-2 text-2xl font-semibold">{journal.title}</h1>
          </div>
          <JournalStar
            slug={param.id}
            initialCount={journal.reactions.length}
            initialAlreadyStarred={Boolean(existingReaction)}
          />
        </div>

        <div className="border border-border/40 p-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-4">
            Entry
          </p>
          <div className="journal-markdown text-sm leading-relaxed text-muted">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={markdownComponents}
            >
              {journal.content}
            </ReactMarkdown>
          </div>
          <div className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between gap-4">
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
          </div>
        </div>
      </div>
    </section>
  );
}

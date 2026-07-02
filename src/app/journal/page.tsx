import Link from "next/link";
import { ArrowLeft, Plus, Rss } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { JournalList } from "@/components/journal/JournalList";
import { getJournals, getAllJournalsForAdmin } from "@/lib/journal";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Xavier Zoom Boulanger's journal, where he shares his ideas, things he finds interesting, random thoughts, and vents.",
  alternates: {
    canonical: "/journal",
    types: {
      "application/rss+xml": "https://zoomhub.xyz/rss.xml",
    },
  },
  openGraph: {
    title: "Journal | Xavier Zoom Boulanger",
    description:
      "Xavier Zoom Boulanger's journal, where he shares his ideas, things he finds interesting, random thoughts, and vents.",
    url: "https://zoomhub.xyz/journal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Journal | Xavier Zoom Boulanger",
    description:
      "Xavier Zoom Boulanger's journal, where he shares his ideas, things he finds interesting, random thoughts, and vents.",
  },
};

export default async function JournalsPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = Boolean(session);
  const journal = isAdmin
    ? await getAllJournalsForAdmin()
    : await getJournals();

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>
          {isAdmin && (
            <Link
              href="/journal/new"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] border border-border/40 px-3 py-2 hover:border-foreground hover:text-foreground transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New entry
            </Link>
          )}
        </div>

        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Journal
            </p>
            <h1 className="mt-2 text-2xl font-semibold">Entry</h1>
          </div>
          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-muted hover:text-foreground transition-colors"
          >
            <Rss className="w-3.5 h-3.5" />
            RSS
          </a>
        </div>

        <JournalList journals={journal} isAdmin={isAdmin} />
      </div>
    </section>
  );
}

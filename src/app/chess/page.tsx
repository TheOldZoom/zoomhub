import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { ChessPageContent } from "@/components/chess/ChessPageContent";
import { fetchStats } from "@/lib/chesscom";

export const metadata: Metadata = {
  title: "Chess",
  description:
    "Xavier Zoom Boulanger's chess.com stats, including ratings, and games.",
  alternates: {
    canonical: "/chess",
  },
  openGraph: {
    title: "Chess | Xavier Zoom Boulanger",
    description:
      "Xavier Zoom Boulanger's chess.com stats, including ratings, and games.",
    url: "https://zoomhub.xyz/chess",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chess | Xavier Zoom Boulanger",
    description:
      "Xavier Zoom Boulanger's chess.com stats, including ratings, and games.",
  },
};

export const dynamic = "force-dynamic";

export default async function ChessPage() {
  const user = process.env.CHESSCOM_USER;
  if (!user) {
    return (
      <div className="min-h-screen py-8 sm:py-12 px-5 lg:px-12 max-w-5xl mx-auto">
        <p className="text-sm text-muted">Chess.com user not configured.</p>
      </div>
    );
  }

  const username = user.toLowerCase();
  const stats = await fetchStats(user);

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </Link>
      <ChessPageContent stats={stats} username={username} />
    </div>
  );
}

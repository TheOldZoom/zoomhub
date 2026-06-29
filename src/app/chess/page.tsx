import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ChessPageContent } from "@/components/chess/ChessPageContent";
import { fetchStats } from "@/lib/chesscom";

export default async function ChessPage() {
  const user = process.env.CHESSCOM_USER;
  if (!user) {
    return (
      <main className="min-h-screen py-8 sm:py-12 px-5 lg:px-12 max-w-5xl mx-auto">
        <p className="text-sm text-muted">Chess.com user not configured.</p>
      </main>
    );
  }

  const username = user.toLowerCase();
  const stats = await fetchStats(user);

  return (
    <main className="min-h-screen py-8 sm:py-12 px-5 lg:px-12 max-w-5xl mx-auto overflow-x-hidden">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </Link>

      <ChessPageContent stats={stats} username={username} />
    </main>
  );
}

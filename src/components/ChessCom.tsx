"use client";

import { useState } from "react";
import Link from "next/link";
import { useChessCom } from "@/hooks/useChessCom";
import { ChessGameRow } from "@/components/ChessGameRow";
import {
  ChessRatings,
  ChessRecords,
  monthlyRecords,
} from "@/components/chess/ChessStats";

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30 gap-3">
      <div className="space-y-1.5">
        <div className="h-3 w-28 bg-border/30 animate-pulse" />
        <div className="h-2 w-20 bg-border/30 animate-pulse" />
      </div>
      <div className="h-2 w-4 bg-border/30 animate-pulse" />
    </div>
  );
}

type Tab = "recent" | "ratings" | "record";

export function ChessCom() {
  const { username, stats, recentGames, byTimeClass, loading } = useChessCom();
  const [tab, setTab] = useState<Tab>("recent");
  const records = monthlyRecords(byTimeClass);

  return (
    <section className="py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted mb-6">
            Chess
          </p>
        </div>
        <Link
          href="/chess"
          className="text-[10px] uppercase tracking-[0.15em] text-muted hover:text-foreground transition"
        >
          View all
        </Link>
      </div>

      <div className="flex lg:hidden gap-2 mb-8">
        {(["recent", "ratings", "record"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 border transition-colors ${
              tab === t
                ? "bg-foreground text-background border-foreground"
                : "border-border/60 text-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className={tab !== "recent" ? "hidden lg:block" : ""}>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
            Recent
          </p>

          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : recentGames.length === 0 ? (
            <p className="text-sm text-muted py-3">No games</p>
          ) : (
            recentGames.map((game: any) => (
              <ChessGameRow key={game.url} game={game} username={username} />
            ))
          )}
        </div>

        <div className={tab !== "ratings" ? "hidden lg:block" : ""}>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
            Ratings
          </p>

          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
          ) : (
            <ChessRatings stats={stats} />
          )}
        </div>

        <div className={tab !== "record" ? "hidden lg:block" : ""}>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
            month
          </p>

          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
          ) : (
            <ChessRecords records={records} />
          )}
        </div>
      </div>
    </section>
  );
}

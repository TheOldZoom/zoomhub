"use client";

import { useEffect, useState } from "react";
import { ChessOverview } from "@/components/chess/ChessOverview";
import { ChessGamesList } from "@/components/chess/ChessGamesList";
import type { ChessActivity } from "@/lib/chesscom";

const EMPTY_ACTIVITY: ChessActivity = {
  memberSince: null,
  totalGames: 0,
  totalSeconds: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  winRate: null,
  byTimeClass: {},
};

interface Props {
  stats: Record<string, any> | null;
  username: string;
}

export function ChessPageContent({ stats, username }: Props) {
  const [games, setGames] = useState<any[] | null>(null);
  const [activity, setActivity] = useState<ChessActivity>(EMPTY_ACTIVITY);
  const [totalGames, setTotalGames] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/chesscom/archive")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || data.error) return;
        setGames(data.games ?? []);
        setActivity(data.activity ?? EMPTY_ACTIVITY);
        setTotalGames(data.totalGames ?? 0);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="mb-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
          Chess
        </p>
        <h1 className="mt-1.5 text-base font-medium">All games</h1>
        <p className="mt-1 text-xs text-muted">
          Bullet · Blitz · Rapid
          {totalGames != null
            ? ` · ${totalGames.toLocaleString()} games`
            : " · loading…"}
        </p>
      </div>

      <ChessOverview stats={stats} activity={activity} loading={games === null} />

      <div className="mt-16">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
          Games
        </p>
        <ChessGamesList
          games={games ?? []}
          username={username}
          loading={games === null}
        />
      </div>
    </>
  );
}

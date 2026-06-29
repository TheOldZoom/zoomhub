"use client";

import { useState } from "react";
import { ChessActivity } from "@/components/chess/ChessActivity";
import {
  ChessRatings,
  ChessRecords,
  allTimeRecords,
} from "@/components/chess/ChessStats";
import type { ChessActivity as ChessActivityData } from "@/lib/chesscom";

type Tab = "ratings" | "record" | "activity";

interface Props {
  stats: Record<string, any> | null;
  activity: ChessActivityData;
  loading?: boolean;
}

export function ChessOverview({ stats, activity, loading }: Props) {
  const [tab, setTab] = useState<Tab>("ratings");

  return (
    <div className="mb-12">
      <div className="flex lg:hidden gap-2 mb-8">
        {(
          [
            { id: "ratings" as const, label: "Ratings" },
            { id: "record" as const, label: "All time" },
            { id: "activity" as const, label: "Activity" },
          ] as const
        ).map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 border transition-colors ${
              tab === id
                ? "bg-foreground text-background border-foreground"
                : "border-border/60 text-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-16 lg:gap-20">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className={tab !== "ratings" ? "hidden lg:block" : ""}>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
            Ratings
          </p>
          <ChessRatings stats={stats} />
        </div>

        <div className={tab !== "record" ? "hidden lg:block" : ""}>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
            All time
          </p>
          <ChessRecords records={allTimeRecords(stats)} />
        </div>
      </div>

      <div className={tab !== "activity" ? "hidden lg:block" : ""}>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
          Activity
        </p>
        <ChessActivity activity={activity} loading={loading} />
      </div>
      </div>
    </div>
  );
}

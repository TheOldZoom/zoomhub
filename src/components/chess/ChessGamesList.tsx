"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { ChessGameRow } from "@/components/ChessGameRow";
import {
  opponentUsername,
  PLAYED_TIME_CLASSES,
  TIME_CLASS_LABELS,
} from "@/lib/chesscom";

const PER_PAGE = 25;
const DEBOUNCE_MS = 600;

interface Props {
  games: any[];
  username: string;
  loading?: boolean;
}

export function ChessGamesList({ games, username, loading }: Props) {
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [timeClass, setTimeClass] = useState("all");
  const [page, setPage] = useState(1);
  const skipDebounce = useRef(true);

  useEffect(() => {
    if (skipDebounce.current) {
      skipDebounce.current = false;
      return;
    }
    const id = setTimeout(() => {
      setQuery(draft.trim());
      setPage(1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [draft]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return games.filter((game) => {
      if (timeClass !== "all" && game.time_class !== timeClass) return false;
      if (!q) return true;
      const opponent = opponentUsername(game, username);
      return opponent?.toLowerCase().includes(q) ?? false;
    });
  }, [games, query, timeClass, username]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PER_PAGE;
  const pageGames = filtered.slice(start, start + PER_PAGE);

  const selectTimeClass = (tc: string | null) => {
    setTimeClass(tc ?? "all");
    setPage(1);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
          <input
            type="search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Search opponent"
            className="w-full pl-8 pr-3 py-2 text-sm bg-transparent border border-border/40 focus:border-border outline-none"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          <FilterButton
            active={timeClass === "all"}
            onClick={() => selectTimeClass(null)}
          >
            All
          </FilterButton>
          {PLAYED_TIME_CLASSES.map((tc) => (
            <FilterButton
              key={tc}
              active={timeClass === tc}
              onClick={() => selectTimeClass(tc)}
            >
              {TIME_CLASS_LABELS[tc]}
            </FilterButton>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-muted mb-3">
        {filtered.length} game{filtered.length === 1 ? "" : "s"}
        {query ? ` matching "${query}"` : ""}
      </p>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-12 bg-border/20 animate-pulse" />
          ))}
        </div>
      ) : pageGames.length === 0 ? (
        <p className="text-sm text-muted py-3">No games found</p>
      ) : (
        <div className="border-t border-border/30">
          {pageGames.map((game) => (
            <ChessGameRow key={game.url} game={game} username={username} />
          ))}
        </div>
      )}

      {filtered.length > PER_PAGE && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-muted hover:text-foreground transition disabled:opacity-20 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Prev
          </button>
          <span className="text-[11px] text-muted font-mono">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-muted hover:text-foreground transition disabled:opacity-20 disabled:pointer-events-none"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[10px] uppercase tracking-[0.15em] px-3 py-1 border transition-colors ${
        active
          ? "bg-foreground text-background border-foreground"
          : "border-border/60 text-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

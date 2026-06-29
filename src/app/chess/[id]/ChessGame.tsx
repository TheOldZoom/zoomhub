"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Chess } from "chess.js";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  RotateCcw,
  Swords,
} from "lucide-react";

interface PlayerMeta {
  username: string;
  rating: number | null;
  result: string;
}

interface GameMeta {
  white: PlayerMeta;
  black: PlayerMeta;
  tc: string;
  date: string | null;
  url: string | null;
  playerColor: "white" | "black";
}

interface Props {
  pgn: string;
  meta: GameMeta;
}

interface MoveEntry {
  san: string;
  fen: string;
  from: string;
  to: string;
  plyIndex: number;
}

function buildPositions(pgn: string) {
  const chess = new Chess();
  try {
    chess.loadPgn(pgn);
  } catch {
    return { fens: [], startFen: new Chess().fen() };
  }
  const history = chess.history({ verbose: true });
  const replay = new Chess();
  const startFen = replay.fen();
  const fens: MoveEntry[] = [];
  for (let i = 0; i < history.length; i++) {
    const m = history[i];
    replay.move(m.san);
    fens.push({
      san: m.san,
      fen: replay.fen(),
      from: m.from,
      to: m.to,
      plyIndex: i,
    });
  }
  return { fens, startFen };
}

function parseFen(fen: string) {
  const [placement] = fen.split(" ");
  const board: (string | null)[][] = [];
  for (const row of placement.split("/")) {
    const rank: (string | null)[] = [];
    for (const ch of row) {
      if (/\d/.test(ch)) for (let i = 0; i < parseInt(ch); i++) rank.push(null);
      else rank.push((ch === ch.toUpperCase() ? "w" : "b") + ch.toUpperCase());
    }
    board.push(rank);
  }
  return board;
}

export function ChessGame({ pgn, meta }: Props) {
  const { fens, startFen } = buildPositions(pgn);
  const total = fens.length;

  const [ply, setPly] = useState(total);
  const [flipped, setFlipped] = useState(meta.playerColor === "black");
  const moveListRef = useRef<HTMLDivElement>(null);

  const currentFen = ply === 0 ? startFen : (fens[ply - 1]?.fen ?? startFen);
  const lastMove = ply > 0 ? fens[ply - 1] : null;
  const board = parseFen(currentFen);

  const go = useCallback(
    (n: number) => setPly((p) => Math.max(0, Math.min(total, p + n))),
    [total],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setPly(0);
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setPly(total);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, total]);

  useEffect(() => {
    moveListRef.current
      ?.querySelector(`[data-ply="${ply - 1}"]`)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [ply]);

  const files = flipped
    ? ["h", "g", "f", "e", "d", "c", "b", "a"]
    : ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = flipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];

  const pairs: { num: number; w?: MoveEntry; b?: MoveEntry }[] = [];
  for (let i = 0; i < fens.length; i += 2) {
    pairs.push({ num: Math.floor(i / 2) + 1, w: fens[i], b: fens[i + 1] });
  }

  const whiteWon = meta.white.result === "Win";
  const blackWon = meta.black.result === "Win";
  const resultStr = whiteWon ? "1–0" : blackWon ? "0–1" : "½–½";

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted mb-1">
          {meta.tc}
          {meta.date ? ` · ${meta.date}` : ""}
        </p>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <div className="flex items-center gap-2 min-w-0">
            <Swords className="w-4 h-4 text-muted shrink-0" />
            <h1 className="text-sm sm:text-base font-medium leading-snug">
              {meta.white.username}{" "}
              <span className="text-muted font-normal">vs</span>{" "}
              {meta.black.username}
            </h1>
          </div>
          <span className="text-sm text-muted font-mono">{resultStr}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
        <div className="w-full lg:w-[min(100%,420px)] lg:shrink-0">
          <div className="w-full max-w-[420px] mx-auto lg:max-w-none">
            <Player
              player={flipped ? meta.white : meta.black}
              won={flipped ? whiteWon : blackWon}
            />

            <div className="grid aspect-square w-full border border-border/40 grid-cols-8 grid-rows-8">
              {ranks.map((rankNum) =>
                files.map((file, fi) => {
                  const ri = 8 - rankNum;
                  const fi2 = file.charCodeAt(0) - 97;
                  const piece = board[ri]?.[fi2] ?? null;
                  const sq = `${file}${rankNum}`;
                  const light = (ri + fi2) % 2 === 1;
                  const hl = lastMove?.from === sq || lastMove?.to === sq;

                  return (
                    <div
                      key={sq}
                      className="relative flex items-center justify-center"
                      style={{
                        background: hl
                          ? light
                            ? "color-mix(in srgb, var(--foreground) 10%, var(--background))"
                            : "color-mix(in srgb, var(--background) 35%, var(--muted))"
                          : light
                            ? "var(--background)"
                            : "var(--muted)",
                      }}
                    >
                      {fi === 0 && (
                        <span
                          className="absolute top-px left-px text-[8px] font-mono leading-none"
                          style={{
                            opacity: 0.55,
                            color: light ? "var(--muted)" : "var(--background)",
                          }}
                        >
                          {rankNum}
                        </span>
                      )}
                      {rankNum === (flipped ? 8 : 1) && (
                        <span
                          className="absolute bottom-px right-px text-[8px] font-mono leading-none"
                          style={{
                            opacity: 0.55,
                            color: light ? "var(--muted)" : "var(--background)",
                          }}
                        >
                          {file}
                        </span>
                      )}
                      {piece && (
                        <img
                          src={`/pieces/cburnett/${piece}.svg`}
                          alt=""
                          draggable={false}
                          className="w-[85%] h-[85%] select-none pointer-events-none"
                        />
                      )}
                    </div>
                  );
                }),
              )}
            </div>

            <Player
              player={flipped ? meta.black : meta.white}
              won={flipped ? blackWon : whiteWon}
            />

            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-1">
                {[
                  {
                    icon: <ChevronsLeft className="w-4 h-4" />,
                    action: () => setPly(0),
                    disabled: ply === 0,
                  },
                  {
                    icon: <ChevronLeft className="w-4 h-4" />,
                    action: () => go(-1),
                    disabled: ply === 0,
                  },
                ].map((btn, i) => (
                  <button
                    key={i}
                    onClick={btn.action}
                    disabled={btn.disabled}
                    className="w-8 h-8 flex items-center justify-center border border-border/40 text-muted hover:text-foreground hover:border-border transition disabled:opacity-20 disabled:pointer-events-none"
                  >
                    {btn.icon}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setFlipped((f) => !f)}
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-muted hover:text-foreground transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Flip
              </button>
              <div className="flex gap-1">
                {[
                  {
                    icon: <ChevronRight className="w-4 h-4" />,
                    action: () => go(1),
                    disabled: ply === total,
                  },
                  {
                    icon: <ChevronsRight className="w-4 h-4" />,
                    action: () => setPly(total),
                    disabled: ply === total,
                  },
                ].map((btn, i) => (
                  <button
                    key={i}
                    onClick={btn.action}
                    disabled={btn.disabled}
                    className="w-8 h-8 flex items-center justify-center border border-border/40 text-muted hover:text-foreground hover:border-border transition disabled:opacity-20 disabled:pointer-events-none"
                  >
                    {btn.icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 h-px bg-border/30">
              <div
                className="h-full bg-foreground transition-all duration-100"
                style={{ width: `${total ? (ply / total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="w-full lg:flex-1 lg:min-w-0">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2">
            Moves
          </p>

          <div
            ref={moveListRef}
            className="overflow-y-auto border border-border/40 max-h-48 sm:max-h-64 lg:max-h-[420px]"
          >
            {pairs.map(({ num, w, b }) => (
              <div
                key={num}
                className="grid border-b border-border/20 last:border-0"
                style={{ gridTemplateColumns: "1.75rem 1fr 1fr" }}
              >
                <span className="flex items-center px-2 text-[10px] text-muted font-mono border-r border-border/20">
                  {num}
                </span>
                {[w, b].map((m, side) =>
                  m ? (
                    <button
                      key={side}
                      data-ply={m.plyIndex}
                      onClick={() => setPly(m.plyIndex + 1)}
                      className={`py-1.5 px-2.5 text-left font-mono text-xs transition-colors ${
                        side === 0 ? "border-r border-border/20" : ""
                      } ${
                        ply === m.plyIndex + 1
                          ? "bg-foreground text-background"
                          : "hover:bg-border/10 text-foreground"
                      }`}
                    >
                      {m.san}
                    </button>
                  ) : (
                    <div key={side} />
                  ),
                )}
              </div>
            ))}
          </div>

          <div className="hidden sm:flex items-center justify-between gap-3 py-3 border-b border-border/40 mt-4">
            <span
              className={`text-sm min-w-0 truncate ${whiteWon ? "" : "text-muted"}`}
            >
              {meta.white.username}
              <span className="text-[10px] text-muted font-mono ml-1.5">
                {meta.white.rating}
              </span>
            </span>
            <span className="text-sm font-mono text-muted shrink-0">
              {resultStr}
            </span>
            <span
              className={`text-sm min-w-0 truncate text-right ${blackWon ? "" : "text-muted"}`}
            >
              {meta.black.username}
              <span className="text-[10px] text-muted font-mono ml-1.5">
                {meta.black.rating}
              </span>
            </span>
          </div>

          {/* Chess.com link */}
          {meta.url && (
            <a
              href={meta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-[10px] uppercase tracking-[0.2em] text-muted hover:text-foreground transition"
            >
              <ExternalLink className="w-3 h-3" />
              Chess.com
            </a>
          )}

          {/* PGN */}
          <details className="mt-4 group">
            <summary className="text-[10px] uppercase tracking-[0.2em] text-muted hover:text-foreground transition cursor-pointer list-none flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 group-open:rotate-90 transition-transform" />
              PGN
            </summary>
            <pre className="mt-2 text-[10px] font-mono leading-relaxed bg-foreground text-background p-4 overflow-x-auto whitespace-pre-wrap break-all">
              {pgn}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}

function Player({ player, won }: { player: PlayerMeta; won: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 min-w-0">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm truncate">{player.username}</span>
        {player.rating && (
          <span className="text-[11px] text-muted font-mono shrink-0">
            {player.rating}
          </span>
        )}
      </div>
      <span
        className={`text-xs shrink-0 ${won ? "text-foreground" : "text-muted"}`}
      >
        {player.result}
      </span>
    </div>
  );
}

import Link from "next/link";
import {
  gameIdFromUrl,
  outcomeFromResult,
  outcomeLabel,
  playerColor,
  TIME_CLASS_LABELS,
} from "@/lib/chesscom";

function timeAgo(ts: number) {
  const diff = Math.floor((Date.now() - ts * 1000) / 1000);
  if (diff < 60) return "now";
  const m = Math.floor(diff / 60);
  const h = Math.floor(diff / 3600);
  const d = Math.floor(diff / 86400);
  if (m < 60) return `${m}m`;
  if (h < 24) return `${h}h`;
  return `${d}d`;
}

interface Props {
  game: any;
  username: string;
}

export function ChessGameRow({ game, username }: Props) {
  const id = gameIdFromUrl(game.url);
  const color = playerColor(game, username);
  const result = color
    ? outcomeLabel(outcomeFromResult(game[color]?.result ?? ""))
    : "?";
  const opponent =
    color === "white" ? game.black : color === "black" ? game.white : null;

  return (
    <Link
      href={id ? `/chess/${id}` : "#"}
      prefetch={false}
      className="flex items-center justify-between py-3 border-b border-border/30 gap-3 group"
    >
      <div className="min-w-0">
        <p className="text-sm truncate group-hover:underline underline-offset-2">
          {opponent?.username ?? "Unknown"}
          {opponent?.rating != null && (
            <span className="text-[10px] text-muted font-mono ml-1.5">
              {opponent.rating}
            </span>
          )}
        </p>
        <p className="text-[11px] text-muted mt-0.5">
          {TIME_CLASS_LABELS[game.time_class] ?? game.time_class}
          {game.end_time ? ` · ${timeAgo(game.end_time)}` : ""}
        </p>
      </div>
      <span
        className={`text-[11px] font-medium shrink-0 ${
          result === "W" ? "text-foreground" : "text-muted"
        }`}
      >
        {result}
      </span>
    </Link>
  );
}

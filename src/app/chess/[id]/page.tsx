import { notFound } from "next/navigation";
import Link from "next/link";
import { ChessGame } from "./ChessGame";
import { ArrowLeft } from "lucide-react";
import {
  findGameById,
  isPlayedTimeClass,
  outcomeFromResult,
  playerColor,
  TIME_CLASS_LABELS,
} from "@/lib/chesscom";

interface Props {
  params: Promise<{ id: string }>;
}

function parseResult(result: string) {
  const outcome = outcomeFromResult(result);
  if (outcome === "win") return "Win";
  if (outcome === "loss") return "Loss";
  return "Draw";
}

export default async function GamePage({ params }: Props) {
  const { id } = await params;
  const user = process.env.CHESSCOM_USER;
  if (!user) notFound();

  const game = await findGameById(user, id);
  if (!game || !isPlayedTimeClass(game.time_class ?? "")) notFound();

  const username = process.env.CHESSCOM_USER?.toLowerCase() ?? "";
  const playerColorResult = playerColor(game, username) ?? "white";

  const date = game.end_time
    ? new Date(game.end_time * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const tc = TIME_CLASS_LABELS[game.time_class] ?? game.time_class;

  const meta = {
    white: {
      username: game.white?.username ?? "",
      rating: game.white?.rating ?? null,
      result: parseResult(game.white?.result ?? ""),
    },
    black: {
      username: game.black?.username ?? "",
      rating: game.black?.rating ?? null,
      result: parseResult(game.black?.result ?? ""),
    },
    tc,
    date,
    url: game.url ?? null,
    playerColor: playerColorResult,
  };

  return (
    <main className="min-h-screen py-8 sm:py-12 px-5 lg:px-12 max-w-5xl mx-auto overflow-x-hidden">
      <Link
        href="/chess"
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </Link>

      <ChessGame pgn={game.pgn ?? ""} meta={meta} />
    </main>
  );
}

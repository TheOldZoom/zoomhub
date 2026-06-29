export const PLAYED_TIME_CLASSES = ["bullet", "blitz", "rapid"] as const;

export const TIME_CLASSES = ["bullet", "blitz", "rapid", "daily"] as const;

export const TIME_CLASS_LABELS: Record<string, string> = {
  bullet: "Bullet",
  blitz: "Blitz",
  rapid: "Rapid",
  daily: "Daily",
};

export const STATS_KEYS: Record<string, string> = {
  bullet: "chess_bullet",
  blitz: "chess_blitz",
  rapid: "chess_rapid",
  daily: "chess_daily",
};

const STATS_LABELS: Record<string, string> = {
  chess_bullet: "Bullet",
  chess_blitz: "Blitz",
  chess_rapid: "Rapid",
  chess_daily: "Daily",
  chess960_bullet: "Chess960 Bullet",
  chess960_blitz: "Chess960 Blitz",
  chess960_rapid: "Chess960 Rapid",
  chess960_daily: "Chess960 Daily",
  bughouse: "Bughouse",
  king_of_the_hill: "King of the Hill",
  three_check: "Three Check",
  crazyhouse: "Crazyhouse",
};

const PLAYED_STATS_KEYS = new Set([
  "chess_bullet",
  "chess_blitz",
  "chess_rapid",
]);

const RATING_ORDER = [
  "chess_bullet",
  "chess_blitz",
  "chess_rapid",
];

function sortByStatsOrder<T extends { key: string; label: string }>(
  items: T[],
  order: string[],
) {
  return items.sort((a, b) => {
    const ai = order.indexOf(a.key);
    const bi = order.indexOf(b.key);
    if (ai === -1 && bi === -1) return a.label.localeCompare(b.label);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export interface ChessActivity {
  memberSince: string | null;
  totalGames: number;
  totalSeconds: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number | null;
  byTimeClass: Record<
    string,
    { games: number; seconds: number; wins: number; losses: number; draws: number }
  >;
}

function parsePgnDuration(pgn: string): number | null {
  const start = pgn.match(/\[StartTime "(\d{2}):(\d{2}):(\d{2})"\]/);
  const end = pgn.match(/\[EndTime "(\d{2}):(\d{2}):(\d{2})"\]/);
  if (!start || !end) return null;
  const toSec = (m: RegExpMatchArray) =>
    parseInt(m[1]) * 3600 + parseInt(m[2]) * 60 + parseInt(m[3]);
  let diff = toSec(end) - toSec(start);
  if (diff < 0) diff += 86400;
  return diff;
}

export function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0m";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h >= 24) {
    const d = Math.floor(h / 24);
    const rh = h % 24;
    return rh > 0 ? `${d}d ${rh}h` : `${d}d`;
  }
  if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`;
  return `${m}m`;
}

export function computeActivity(
  games: any[],
  username: string,
  stats: Record<string, any> | null,
  profile: { joined?: number } | null,
): ChessActivity {
  const byTimeClass: ChessActivity["byTimeClass"] = {};
  let totalSeconds = 0;

  for (const g of filterPlayedGames(games)) {
    const tc = g.time_class ?? "unknown";
    if (!byTimeClass[tc]) {
      byTimeClass[tc] = { games: 0, seconds: 0, wins: 0, losses: 0, draws: 0 };
    }

    byTimeClass[tc].games++;
    const duration = parsePgnDuration(g.pgn ?? "");
    if (duration != null) {
      byTimeClass[tc].seconds += duration;
      totalSeconds += duration;
    }

    const color = playerColor(g, username);
    if (!color) continue;
    const outcome = outcomeFromResult(g[color]?.result ?? "");
    if (outcome === "win") byTimeClass[tc].wins++;
    else if (outcome === "loss") byTimeClass[tc].losses++;
    else byTimeClass[tc].draws++;
  }

  let wins = 0;
  let losses = 0;
  let draws = 0;
  for (const key of PLAYED_STATS_KEYS) {
    const record = stats?.[key]?.record;
    if (!record) continue;
    wins += record.win ?? 0;
    losses += record.loss ?? 0;
    draws += record.draw ?? 0;
  }

  const decided = wins + losses + draws;
  const memberSince = profile?.joined
    ? new Date(profile.joined * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : null;

  return {
    memberSince,
    totalGames: games.length,
    totalSeconds,
    wins,
    losses,
    draws,
    winRate: decided > 0 ? Math.round((wins / decided) * 1000) / 10 : null,
    byTimeClass,
  };
}

const BASE = "https://api.chess.com/pub";
const HEADERS = { "User-Agent": "portfolio-site/1.0 (your@email.com)" };

export function isPlayedTimeClass(tc: string): boolean {
  return (PLAYED_TIME_CLASSES as readonly string[]).includes(tc);
}

export function filterPlayedGames(games: any[]): any[] {
  return games.filter((g) => isPlayedTimeClass(g.time_class ?? ""));
}

export function formatStatsKey(key: string): string {
  return (
    STATS_LABELS[key] ??
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function listRatings(stats: Record<string, any> | null) {
  if (!stats) return [];

  const items: { key: string; label: string; rating: number }[] = [];

  for (const key of PLAYED_STATS_KEYS) {
    const rating = stats[key]?.last?.rating;
    if (typeof rating === "number") {
      items.push({ key, label: formatStatsKey(key), rating });
    }
  }

  return sortByStatsOrder(items, RATING_ORDER);
}

export function listAllTimeRecords(stats: Record<string, any> | null) {
  if (!stats) return [];

  const items: {
    key: string;
    label: string;
    wins: number;
    losses: number;
    draws: number;
  }[] = [];

  for (const key of PLAYED_STATS_KEYS) {
    const record = stats[key]?.record;
    if (!record) continue;
    items.push({
      key,
      label: formatStatsKey(key),
      wins: record.win ?? 0,
      losses: record.loss ?? 0,
      draws: record.draw ?? 0,
    });
  }

  return sortByStatsOrder(items, RATING_ORDER);
}

export function playerColor(
  game: { white?: { username?: string }; black?: { username?: string } },
  username: string,
): "white" | "black" | null {
  const u = username.toLowerCase();
  if (game.white?.username?.toLowerCase() === u) return "white";
  if (game.black?.username?.toLowerCase() === u) return "black";
  return null;
}

export function outcomeFromResult(
  result: string,
): "win" | "loss" | "draw" {
  if (result === "win") return "win";
  if (["checkmated", "resigned", "timeout", "abandoned"].includes(result))
    return "loss";
  return "draw";
}

export function outcomeLabel(outcome: "win" | "loss" | "draw"): string {
  if (outcome === "win") return "W";
  if (outcome === "loss") return "L";
  return "D";
}

export function gameIdFromUrl(url: string | undefined): string {
  return String(url ?? "").split("/").pop() ?? "";
}

export function opponentUsername(
  game: { white?: { username?: string }; black?: { username?: string } },
  username: string,
): string | null {
  const color = playerColor(game, username);
  if (color === "white") return game.black?.username ?? null;
  if (color === "black") return game.white?.username ?? null;
  return null;
}

export function parseGamesByTimeClass(games: any[], username: string) {
  const byTimeClass: Record<
    string,
    { wins: number; losses: number; draws: number; total: number }
  > = {};

  for (const g of filterPlayedGames(games)) {
    const color = playerColor(g, username);
    if (!color) continue;

    const tc = g.time_class ?? "unknown";
    if (!byTimeClass[tc])
      byTimeClass[tc] = { wins: 0, losses: 0, draws: 0, total: 0 };

    const outcome = outcomeFromResult(g[color]?.result ?? "");

    byTimeClass[tc].total++;
    if (outcome === "win") byTimeClass[tc].wins++;
    else if (outcome === "loss") byTimeClass[tc].losses++;
    else byTimeClass[tc].draws++;
  }

  return byTimeClass;
}

export async function fetchProfile(user: string) {
  const res = await fetch(`${BASE}/player/${user}`, {
    headers: HEADERS,
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchStats(user: string) {
  const res = await fetch(`${BASE}/player/${user}/stats`, {
    headers: HEADERS,
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchArchives(user: string): Promise<string[]> {
  const res = await fetch(`${BASE}/player/${user}/games/archives`, {
    headers: HEADERS,
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const body = await res.json();
  return body.archives ?? [];
}

async function fetchArchiveGames(url: string): Promise<any[]> {
  const res = await fetch(url, {
    headers: HEADERS,
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const body = await res.json();
  return body.games ?? [];
}

async function fetchArchivesInBatches(urls: string[], batchSize = 10) {
  const games: any[] = [];
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(fetchArchiveGames));
    games.push(...results.flat());
  }
  return games;
}

export async function fetchAllPlayedGames(user: string) {
  const archives = await fetchArchives(user);
  const games = await fetchArchivesInBatches([...archives].reverse());
  return filterPlayedGames(games).sort(
    (a, b) => (b.end_time ?? 0) - (a.end_time ?? 0),
  );
}

const allGamesCache = new Map<string, { exp: number; data: any[] }>();
const ALL_GAMES_TTL = 1000 * 60 * 5;

export async function fetchAllPlayedGamesCached(user: string) {
  const hit = allGamesCache.get(user);
  if (hit && Date.now() < hit.exp) return hit.data;
  const games = await fetchAllPlayedGames(user);
  allGamesCache.set(user, { exp: Date.now() + ALL_GAMES_TTL, data: games });
  return games;
}

export function stripGamePgn(game: any) {
  const { pgn: _, ...rest } = game;
  return rest;
}

export async function findGameById(user: string, id: string) {
  const archives = await fetchArchives(user);
  for (const url of [...archives].reverse()) {
    const games = await fetchArchiveGames(url);
    const match = games.find((g) => gameIdFromUrl(g.url) === id);
    if (match) return match;
  }
  return null;
}

export async function fetchGames(user: string, monthCount = 3) {
  const now = new Date();
  const games: any[] = [];

  for (let offset = 0; offset < monthCount; offset++) {
    const d = new Date(now.getUTCFullYear(), now.getUTCMonth() - offset, 1);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");

    const res = await fetch(`${BASE}/player/${user}/games/${year}/${month}`, {
      headers: HEADERS,
      next: { revalidate: 300 },
    });
    if (!res.ok) continue;
    const body = await res.json();
    games.push(...(body.games ?? []));
  }

  return filterPlayedGames(games).sort(
    (a, b) => (b.end_time ?? 0) - (a.end_time ?? 0),
  );
}

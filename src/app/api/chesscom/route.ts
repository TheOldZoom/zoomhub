import { filterPlayedGames, parseGamesByTimeClass } from "@/lib/chesscom";

const profileCache = new Map<string, { exp: number; data: any }>();
const statsCache = new Map<string, { exp: number; data: any }>();
const gamesCache = new Map<string, { exp: number; data: any }>();

const PROFILE_TTL = 1000 * 60 * 60;
const STATS_TTL = 1000 * 60 * 10;
const GAMES_TTL = 1000 * 60 * 5;

const BASE = "https://api.chess.com/pub";
const HEADERS = {
  "User-Agent":
    "zoomhub.xyz/1.2 (username: theoldzoom; contact: theoldzoom@proton.me)",
};

function buildGamesUrl(user: string, date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${BASE}/player/${user}/games/${year}/${month}`;
}

function getCache<T>(
  map: Map<string, { exp: number; data: T }>,
  key: string,
): T | null {
  const hit = map.get(key);
  if (!hit) return null;
  if (Date.now() > hit.exp) {
    map.delete(key);
    return null;
  }
  return hit.data;
}

function setCache<T>(
  map: Map<string, { exp: number; data: T }>,
  key: string,
  data: T,
  ttl: number,
) {
  map.set(key, { exp: Date.now() + ttl, data });
}

export async function GET() {
  const user = process.env.CHESSCOM_USER;
  if (!user)
    return Response.json({ error: "Missing CHESSCOM_USER" }, { status: 400 });

  try {
    let profile = getCache(profileCache, user);
    if (!profile) {
      const res = await fetch(`${BASE}/player/${user}`, { headers: HEADERS });
      profile = await res.json();
      setCache(profileCache, user, profile, PROFILE_TTL);
    }

    let stats = getCache(statsCache, user);
    if (!stats) {
      const res = await fetch(`${BASE}/player/${user}/stats`, {
        headers: HEADERS,
      });
      stats = await res.json();
      setCache(statsCache, user, stats, STATS_TTL);
    }

    let games = getCache(gamesCache, user);
    if (!games) {
      const now = new Date();
      let res = await fetch(buildGamesUrl(user, now), {
        headers: HEADERS,
        cache: "no-store",
      });
      let body = await res.json();

      if (
        !res.ok &&
        res.status === 404 &&
        body?.message === "Date cannot be set in the future"
      ) {
        const fallbackDate = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1),
        );
        res = await fetch(buildGamesUrl(user, fallbackDate), {
          headers: HEADERS,
          cache: "no-store",
        });
        body = await res.json();
      }

      games = body.games ?? [];
      setCache(gamesCache, user, games, GAMES_TTL);
    }

    const username = user.toLowerCase();
    const played = filterPlayedGames(games as any[]);
    const sorted = [...played].sort(
      (a, b) => (b.end_time ?? 0) - (a.end_time ?? 0),
    );
    const recentGames = sorted.slice(0, 5);
    const byTimeClass = parseGamesByTimeClass(played, username);
    return Response.json({
      username,
      profile,
      stats,
      recentGames,
      byTimeClass,
    });
  } catch {
    return Response.json(
      { error: "Failed to fetch Chess.com data" },
      { status: 500 },
    );
  }
}

import {
  fetchLastFmRecent,
  fetchLastFmTopAlbums,
  fetchLastFmTopArtists,
  fetchLastFmTopTracks,
  fetchLastFmUser,
} from "@/lib/lastfm";

const PERIODS = new Set([
  "7day",
  "1month",
  "3month",
  "6month",
  "12month",
  "overall",
]);

const payloadCache = new Map<string, { exp: number; data: any }>();
const PAYLOAD_TTL = 1000 * 60 * 5;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const period = url.searchParams.get("period") ?? "7day";

  if (!PERIODS.has(period)) {
    return Response.json(
      {
        error:
          "Invalid period. Use 7day, 1month, 3month, 6month, 12month or overall.",
      },
      { status: 400 },
    );
  }

  const cacheKey = `lastfm:payload:${period}`;
  const cached = payloadCache.get(cacheKey);
  if (cached && Date.now() < cached.exp) {
    return Response.json(cached.data);
  }

  try {
    const [user, recentTracks, topArtists, topAlbums, topTracks] =
      await Promise.all([
        fetchLastFmUser(),
        fetchLastFmRecent(20),
        fetchLastFmTopArtists(period, 20),
        fetchLastFmTopAlbums(period, 20),
        fetchLastFmTopTracks(period, 20),
      ]);

    const payload = {
      period,
      user,
      recentTracks,
      topArtists,
      topAlbums,
      topTracks,
    };

    payloadCache.set(cacheKey, {
      exp: Date.now() + PAYLOAD_TTL,
      data: payload,
    });

    return Response.json(payload);
  } catch (error) {
    return Response.json(
      { error: "Server error fetching Last.fm data" },
      { status: 500 },
    );
  }
}

import {
  fetchLastFmRecent,
  fetchLastFmTopAlbums,
  fetchLastFmTopArtists,
  fetchLastFmTopTracks,
  fetchLastFmUser,
} from "@/lib/lastfm";

export const dynamic = "force-dynamic";

const PERIODS = new Set([
  "7day",
  "1month",
  "3month",
  "6month",
  "12month",
  "overall",
]);

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

    return Response.json(payload);
  } catch (error) {
    return Response.json(
      { error: "Server error fetching Last.fm data" },
      { status: 500 },
    );
  }
}

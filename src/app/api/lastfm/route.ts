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
        fetchLastFmRecent(50),
        fetchLastFmTopArtists(period, 50),
        fetchLastFmTopAlbums(period, 50),
        fetchLastFmTopTracks(period, 50),
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
    console.error("Error fetching Last.fm data:", error);
    return Response.json(
      { error: "Server error fetching Last.fm data" },
      { status: 500 },
    );
  }
}

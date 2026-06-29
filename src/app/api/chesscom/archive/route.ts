import {
  computeActivity,
  fetchAllPlayedGamesCached,
  fetchProfile,
  fetchStats,
  stripGamePgn,
} from "@/lib/chesscom";

export async function GET() {
  const user = process.env.CHESSCOM_USER;
  if (!user)
    return Response.json({ error: "Missing CHESSCOM_USER" }, { status: 400 });

  try {
    const username = user.toLowerCase();
    const [games, stats, profile] = await Promise.all([
      fetchAllPlayedGamesCached(user),
      fetchStats(user),
      fetchProfile(user),
    ]);

    const activity = computeActivity(games, username, stats, profile);

    return Response.json({
      games: games.map(stripGamePgn),
      activity,
      totalGames: games.length,
    });
  } catch {
    return Response.json(
      { error: "Failed to fetch Chess.com archive" },
      { status: 500 },
    );
  }
}

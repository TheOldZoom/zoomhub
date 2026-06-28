import { spotifyFetch } from "@/lib/spotify";

export async function GET() {
  const artistId = process.env.SPOTIFY_ARTIST_ID;

  const data = await spotifyFetch(
    `artists/${artistId}/albums?include_groups=album,single`,
  );

  return Response.json(data);
}

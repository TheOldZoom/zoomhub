export async function GET() {
  const user = process.env.LASTFM_USER;
  const apiKey = process.env.LASTFM_API_KEY;

  if (!user || !apiKey) {
    return Response.json({ error: "Missing Last.fm config" }, { status: 400 });
  }

  const res = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${apiKey}&format=json&limit=10`,
    {
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) {
    return Response.json({ error: "Last.fm request failed" }, { status: 500 });
  }

  const data = await res.json();

  return Response.json(data);
}

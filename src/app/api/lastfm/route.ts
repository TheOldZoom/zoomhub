const LASTFM_PLACEHOLDER = "2a96cbd8b46e442fc41c2b86b821562f";

const imageCache = new Map<string, string>();
const missCache = new Map<string, number>();

const MISS_TTL = 1000 * 60 * 60 * 24;

function isMissCached(key: string) {
  const hit = missCache.get(key);
  if (!hit) return false;
  return Date.now() < hit;
}

function setMiss(key: string) {
  missCache.set(key, Date.now() + MISS_TTL);
}

function setCache(key: string, value: string) {
  imageCache.set(key, value);
}

function getCache(key: string) {
  return imageCache.get(key);
}

function isPlaceholder(url: string) {
  return url.includes(LASTFM_PLACEHOLDER);
}

function pickLastFmImage(images: any[] = []) {
  if (!Array.isArray(images)) return "";

  return (
    images.find((i) => i.size === "extralarge")?.["#text"] ||
    images.find((i) => i.size === "large")?.["#text"] ||
    images.find((i) => i.size === "medium")?.["#text"] ||
    ""
  );
}

async function verifyImage(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

async function getPageImage(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0",
      },
    });

    if (!res.ok) return "";

    const html = await res.text();

    const match = html.match(
      /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/,
    );

    const image = match?.[1] ?? "";

    if (!image) return "";
    if (isPlaceholder(image)) return "";

    return image;
  } catch {
    return "";
  }
}

async function enrichArtistImage(artist: any) {
  const key = artist.url || artist.name;

  if (!key) return artist;

  const cached = getCache(key);
  if (cached) return { ...artist, image: cached };

  if (isMissCached(key)) return artist;

  let image = pickLastFmImage(artist.image);

  if (image && !isPlaceholder(image)) {
    const ok = await verifyImage(image);
    if (ok) {
      setCache(key, image);
      return { ...artist, image };
    }
  }

  if (artist.url) {
    const pageImage = await getPageImage(artist.url);

    if (pageImage) {
      const ok = await verifyImage(pageImage);

      if (ok) {
        setCache(key, pageImage);
        return { ...artist, image: pageImage };
      }
    }
  }

  setMiss(key);
  return artist;
}

export async function GET() {
  const user = process.env.LASTFM_USER;
  const apiKey = process.env.LASTFM_API_KEY;

  if (!user || !apiKey) {
    return Response.json({ error: "Missing Last.fm config" }, { status: 400 });
  }

  const base = "https://ws.audioscrobbler.com/2.0/";

  const recentUrl = `${base}?method=user.getrecenttracks&user=${user}&api_key=${apiKey}&format=json&limit=10`;
  const artistsUrl = `${base}?method=user.gettopartists&user=${user}&api_key=${apiKey}&format=json&limit=10&period=7day`;
  const albumsUrl = `${base}?method=user.gettopalbums&user=${user}&api_key=${apiKey}&format=json&limit=10&period=7day`;
  const tracksUrl = `${base}?method=user.gettoptracks&user=${user}&api_key=${apiKey}&format=json&limit=10&period=7day`;

  try {
    const [recentRes, artistsRes, albumsRes, tracksRes] = await Promise.all([
      fetch(recentUrl, { next: { revalidate: 60 } }),
      fetch(artistsUrl, { next: { revalidate: 60 } }),
      fetch(albumsUrl, { next: { revalidate: 60 } }),
      fetch(tracksUrl, { next: { revalidate: 60 } }),
    ]);

    const [recent, artists, albums, tracks] = await Promise.all([
      recentRes.json(),
      artistsRes.json(),
      albumsRes.json(),
      tracksRes.json(),
    ]);

    const topArtists = artists.topartists?.artist ?? [];
    const topTracks = tracks.toptracks?.track ?? [];

    const [finalArtists] = await Promise.all([
      Promise.allSettled(
        topArtists.map((artist: any) => enrichArtistImage(artist)),
      ),
    ]);

    const enrichedArtists = finalArtists
      .map((r) => (r.status === "fulfilled" ? r.value : null))
      .filter(Boolean);

    return Response.json({
      recentTracks: recent.recenttracks?.track ?? [],
      topAlbums: albums.topalbums?.album ?? [],
      topArtists: enrichedArtists,
      topTracks,
    });
  } catch {
    return Response.json(
      { error: "Server error fetching Last.fm data" },
      { status: 500 },
    );
  }
}

const LASTFM_PLACEHOLDER = "2a96cbd8b46e442fc41c2b86b821562f";

const imageCache = new Map<string, string>();
const missCache = new Map<string, number>();

const topCache = new Map<string, { exp: number; data: any }>();

const MISS_TTL = 1000 * 60 * 60 * 24;
const TOP_TTL = 1000 * 60 * 10;

function isMissCached(key: string) {
  const hit = missCache.get(key);
  return !!hit && Date.now() < hit;
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

function getTopCache(key: string) {
  const hit = topCache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.exp) {
    topCache.delete(key);
    return null;
  }
  return hit.data;
}

function setTopCache(key: string, data: any) {
  topCache.set(key, {
    exp: Date.now() + TOP_TTL,
    data,
  });
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

async function verifyImage(url: string) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

async function getPageImage(url: string) {
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0" },
    });

    if (!res.ok) return "";

    const html = await res.text();

    const match = html.match(
      /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/,
    );

    const image = match?.[1] ?? "";
    if (!image || isPlaceholder(image)) return "";

    return image;
  } catch {
    return "";
  }
}

async function enrichArtistImage(artist: any) {
  const key = `artist:${artist.url || artist.name}`;

  const cached = getCache(key);
  if (cached) return { ...artist, image: cached };

  if (isMissCached(key)) return artist;

  let image = pickLastFmImage(artist.image);

  if (image && !isPlaceholder(image)) {
    if (await verifyImage(image)) {
      setCache(key, image);
      return { ...artist, image };
    }
  }

  if (artist.url) {
    const pageImage = await getPageImage(artist.url);
    if (pageImage && (await verifyImage(pageImage))) {
      setCache(key, pageImage);
      return { ...artist, image: pageImage };
    }
  }

  setMiss(key);
  return artist;
}

async function enrichTrack(track: any) {
  const key = `track:${track.url || track.name + track.artist?.name}`;

  const cached = getCache(key);
  if (cached) return { ...track, image: cached };

  if (isMissCached(key)) return track;

  let image =
    Array.isArray(track.image) && track.image.length
      ? pickLastFmImage(track.image)
      : "";

  if (image && !isPlaceholder(image)) {
    if (await verifyImage(image)) {
      setCache(key, image);
      return { ...track, image };
    }
  }

  if (track.url) {
    const pageImage = await getPageImage(track.url);
    if (pageImage && (await verifyImage(pageImage))) {
      setCache(key, pageImage);
      return { ...track, image: pageImage };
    }
  }

  setMiss(key);
  return track;
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

  const artistsKey = `topartists:${user}`;
  const albumsKey = `topalbums:${user}`;
  const tracksKey = `toptracks:${user}`;

  try {
    const cachedArtists = getTopCache(artistsKey);
    const cachedAlbums = getTopCache(albumsKey);
    const cachedTracks = getTopCache(tracksKey);

    const recentRes = await fetch(recentUrl, { cache: "no-store" });
    const recent = await recentRes.json();

    const artistsRes = cachedArtists
      ? null
      : await fetch(artistsUrl, { cache: "no-store" });

    const albumsRes = cachedAlbums
      ? null
      : await fetch(albumsUrl, { cache: "no-store" });

    const tracksRes = cachedTracks
      ? null
      : await fetch(tracksUrl, { cache: "no-store" });

    const artists = cachedArtists ?? (await artistsRes!.json());
    const albums = cachedAlbums ?? (await albumsRes!.json());
    const tracks = cachedTracks ?? (await tracksRes!.json());

    if (!cachedArtists) setTopCache(artistsKey, artists);
    if (!cachedAlbums) setTopCache(albumsKey, albums);
    if (!cachedTracks) setTopCache(tracksKey, tracks);

    const topArtists = artists.topartists?.artist ?? [];
    const topAlbums = albums.topalbums?.album ?? [];
    const topTracks = tracks.toptracks?.track ?? [];

    const [enrichedArtists, enrichedTracks] = await Promise.all([
      Promise.all(topArtists.map(enrichArtistImage)),
      Promise.all(topTracks.map(enrichTrack)),
    ]);

    return Response.json({
      recentTracks: recent.recenttracks?.track ?? [],
      topAlbums,
      topArtists: enrichedArtists,
      topTracks: enrichedTracks,
    });
  } catch {
    return Response.json(
      { error: "Server error fetching Last.fm data" },
      { status: 500 },
    );
  }
}

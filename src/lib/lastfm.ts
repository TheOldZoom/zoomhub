import { prisma } from "@/lib/prisma";

const LASTFM_PLACEHOLDER = "2a96cbd8b46e442fc41c2b86b821562f";
const BASE_URL = "https://ws.audioscrobbler.com/2.0/";

const MISS_TTL = 1000 * 60 * 60 * 24;
const TOP_TTL = 1000 * 60 * 10;

type CacheValue = string | { miss?: true };

function isMissValue(value: unknown): value is { miss?: true } {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    "miss" in value
  );
}

async function getTopCache(key: string) {
  const entry = await prisma.lastfmCache.findUnique({
    where: { key },
  });

  if (!entry || entry.expiresAt <= new Date()) {
    return null;
  }

  return entry.value as CacheValue;
}

async function setTopCache(key: string, data: any, ttl = TOP_TTL) {
  const expiresAt = new Date(Date.now() + ttl);
  await prisma.lastfmCache.upsert({
    where: { key },
    create: { key, value: data, expiresAt },
    update: { value: data, expiresAt },
  });
}

async function getCache(key: string) {
  const entry = await prisma.lastfmCache.findUnique({
    where: { key },
  });

  if (!entry || entry.expiresAt <= new Date()) {
    return null;
  }

  const value = entry.value as CacheValue | null;
  if (isMissValue(value) && value.miss === true) {
    return null;
  }

  return value;
}

async function setCache(key: string, value: string) {
  const expiresAt = new Date(Date.now() + MISS_TTL);
  await prisma.lastfmCache.upsert({
    where: { key },
    create: { key, value, expiresAt },
    update: { value, expiresAt },
  });
}

async function isMissCached(key: string) {
  const entry = await prisma.lastfmCache.findUnique({
    where: { key },
  });

  if (!entry || entry.expiresAt <= new Date()) {
    return false;
  }

  const value = entry.value as CacheValue | null;
  return isMissValue(value) && value.miss === true;
}

async function setMiss(key: string) {
  const expiresAt = new Date(Date.now() + MISS_TTL);
  await prisma.lastfmCache.upsert({
    where: { key },
    create: { key, value: { miss: true }, expiresAt },
    update: { value: { miss: true }, expiresAt },
  });
}

function getApiConfig() {
  const user = process.env.LASTFM_USER;
  const apiKey = process.env.LASTFM_API_KEY;
  if (!user || !apiKey) {
    throw new Error("Missing Last.fm config");
  }
  return { user, apiKey };
}

function buildUrl(method: string, params: Record<string, string> = {}) {
  const { user, apiKey } = getApiConfig();
  const url = new URL(BASE_URL);
  url.searchParams.set("method", method);
  url.searchParams.set("user", user);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("format", "json");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return url.toString();
}

function isPlaceholder(url: string) {
  return !url || url.includes(LASTFM_PLACEHOLDER);
}

function pickLastFmImage(images: any): string {
  if (!images) return "";
  if (typeof images === "string") return images;
  if (Array.isArray(images)) {
    return (
      images.find((i) => i.size === "extralarge")?.["#text"] ||
      images.find((i) => i.size === "mega")?.["#text"] ||
      images.find((i) => i.size === "large")?.["#text"] ||
      images.find((i) => i.size === "medium")?.["#text"] ||
      ""
    );
  }
  if (typeof images === "object" && typeof images["#text"] === "string") {
    return images["#text"];
  }
  return "";
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
  const cached = await getCache(key);
  if (cached) return { ...artist, image: cached };

  let image = pickLastFmImage(artist.image);
  if (image && !isPlaceholder(image)) {
    if (await verifyImage(image)) {
      await setCache(key, image);
      return { ...artist, image };
    }
  }

  if (artist.url) {
    const pageImage = await getPageImage(artist.url);
    if (pageImage && (await verifyImage(pageImage))) {
      await setCache(key, pageImage);
      return { ...artist, image: pageImage };
    }
  }

  await setMiss(key);
  return artist;
}

async function enrichTrack(track: any) {
  const key = `track:${track.url || track.name + track.artist?.name}`;
  const cached = await getCache(key);
  if (cached) return { ...track, image: cached };

  let image =
    Array.isArray(track.image) && track.image.length
      ? pickLastFmImage(track.image)
      : "";

  if (image && !isPlaceholder(image)) {
    if (await verifyImage(image)) {
      await setCache(key, image);
      return { ...track, image };
    }
  }

  if (track.url) {
    const pageImage = await getPageImage(track.url);
    if (pageImage && (await verifyImage(pageImage))) {
      await setCache(key, pageImage);
      return { ...track, image: pageImage };
    }
  }

  await setMiss(key);
  return track;
}

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Last.fm request failed: ${res.status}`);
  }
  return res.json();
}

async function fetchLastFmPaged(
  method: string,
  params: Record<string, string>,
  rootKey: string,
  itemKey: string,
  pageSize = 200,
) {
  const firstUrl = buildUrl(method, {
    ...params,
    limit: String(pageSize),
    page: "1",
  });
  const firstBody = await fetchJson(firstUrl);
  const firstRoot = firstBody?.[rootKey];
  const items = [...(firstRoot?.[itemKey] ?? [])];
  const totalPages = Number(firstRoot?.["@attr"]?.totalPages ?? 1);

  for (let page = 2; page <= totalPages; page++) {
    const pageUrl = buildUrl(method, {
      ...params,
      limit: String(pageSize),
      page: String(page),
    });
    const pageBody = await fetchJson(pageUrl);
    const pageRoot = pageBody?.[rootKey];
    items.push(...(pageRoot?.[itemKey] ?? []));
  }

  return items;
}

export async function fetchLastFmRecent(limit = 20) {
  if (limit === 0) {
    const recent = await fetchLastFmPaged(
      "user.getrecenttracks",
      {},
      "recenttracks",
      "track",
      200,
    );
    return await Promise.all(recent.map(enrichTrack));
  }

  const url = buildUrl("user.getrecenttracks", {
    limit: String(limit),
  });
  const body = await fetchJson(url);
  const recent = body.recenttracks?.track ?? [];
  return await Promise.all(recent.map(enrichTrack));
}

export async function fetchLastFmTopArtists(period = "7day", limit = 20) {
  let artists: any[];
  if (limit === 0) {
    artists = await fetchLastFmPaged(
      "user.gettopartists",
      { period },
      "topartists",
      "artist",
      200,
    );
  } else {
    const url = buildUrl("user.gettopartists", {
      period,
      limit: String(limit),
    });
    const body = await fetchJson(url);
    artists = body.topartists?.artist ?? [];
  }

  return await Promise.all(artists.map(enrichArtistImage));
}

async function enrichAlbumImage(album: any) {
  const key = `album:${album.url || album.name + album.artist?.name}`;
  const cached = await getCache(key);
  if (cached) return { ...album, image: cached };

  let image = pickLastFmImage(album.image);
  if (image && !isPlaceholder(image)) {
    if (await verifyImage(image)) {
      await setCache(key, image);
      return { ...album, image };
    }
  }

  if (album.url) {
    const pageImage = await getPageImage(album.url);
    if (pageImage && (await verifyImage(pageImage))) {
      await setCache(key, pageImage);
      return { ...album, image: pageImage };
    }
  }

  await setMiss(key);
  return album;
}

export async function fetchLastFmTopAlbums(period = "7day", limit = 20) {
  let albums: any[];
  if (limit === 0) {
    albums = await fetchLastFmPaged(
      "user.gettopalbums",
      { period },
      "topalbums",
      "album",
      200,
    );
  } else {
    const url = buildUrl("user.gettopalbums", {
      period,
      limit: String(limit),
    });
    const body = await fetchJson(url);
    albums = body.topalbums?.album ?? [];
  }

  return await Promise.all(albums.map(enrichAlbumImage));
}

export async function fetchLastFmTopTracks(period = "7day", limit = 20) {
  let tracks: any[];
  if (limit === 0) {
    tracks = await fetchLastFmPaged(
      "user.gettoptracks",
      { period },
      "toptracks",
      "track",
      200,
    );
  } else {
    const url = buildUrl("user.gettoptracks", {
      period,
      limit: String(limit),
    });
    const body = await fetchJson(url);
    tracks = body.toptracks?.track ?? [];
  }

  return await Promise.all(tracks.map(enrichTrack));
}

export async function fetchLastFmUser() {
  const { user } = getApiConfig();
  const cacheKey = `user:${user}`;
  const cached = await getTopCache(cacheKey);
  if (cached) return cached;

  const body = await fetchJson(buildUrl("user.getinfo"));
  const profile = body.user ?? null;
  await setTopCache(cacheKey, profile);
  return profile;
}

export async function fetchLastFmSummary() {
  const [user, recentTracks, topArtists, topAlbums, topTracks] =
    await Promise.all([
      fetchLastFmUser(),
      fetchLastFmRecent(20),
      fetchLastFmTopArtists("7day", 20),
      fetchLastFmTopAlbums("7day", 20),
      fetchLastFmTopTracks("7day", 20),
    ]);

  return {
    user,
    recentTracks,
    topArtists,
    topAlbums,
    topTracks,
  };
}

export type LastFmUser = {
  name: string;
  url: string;
  country?: string;
  playcount?: string;
  registered?: { unixtime: string };
  image?: any[];
};

export type LastFmArtist = any;
export type LastFmAlbum = any;
export type LastFmTrack = any;

"use client";

import { useEffect, useState } from "react";
import type {
  LastFmAlbum,
  LastFmArtist,
  LastFmTrack,
  LastFmUser,
} from "@/lib/lastfm";

const PERIODS = [
  { label: "7d", value: "7day" },
  { label: "30d", value: "1month" },
  { label: "90d", value: "3month" },
  { label: "180d", value: "6month" },
  { label: "365d", value: "12month" },
  {
    label: `${formatCount(
      Math.floor(
        (Date.now() - new Date("2024-08-23").getTime()) / (1000 * 60 * 60 * 24),
      ),
    )}d`,
    value: "overall",
  },
] as const;

type Period = (typeof PERIODS)[number]["value"];

type ApiResponse = {
  period: string;
  user: LastFmUser | null;
  recentTracks: LastFmTrack[];
  topAlbums: LastFmAlbum[];
  topArtists: LastFmArtist[];
  topTracks: LastFmTrack[];
};

function timeAgo(timestamp: string) {
  const now = Date.now();
  const then = parseInt(timestamp, 10) * 1000;
  const diff = Math.floor((now - then) / 1000);

  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(diff / 3600);
  const days = Math.floor(diff / 86400);

  if (diff < 60) return "just now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

function getImage(image: any): string {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (Array.isArray(image)) {
    return (
      image.find((i) => i.size === "extralarge")?.["#text"] ||
      image.find((i) => i.size === "large")?.["#text"] ||
      image.find((i) => i.size === "medium")?.["#text"] ||
      image.find((i) => i.size === "small")?.["#text"] ||
      ""
    );
  }
  return "";
}

function formatCount(value: number | string | undefined) {
  return Number(value || 0).toLocaleString();
}

function getPeriodLabel(period: Period) {
  return PERIODS.find((item) => item.value === period)?.label ?? period;
}

function SummaryRow({
  label,
  value,
  secondary,
}: {
  label: string;
  value: string;
  secondary?: string;
}) {
  return (
    <div className="flex flex-col border-b border-border/30">
      <div className="flex items-center justify-between py-3">
        <p className="text-sm">{label}</p>
        <span className="text-xs text-muted font-mono">{value}</span>
      </div>
      {secondary ? (
        <p className="px-0 pb-3 text-xs text-muted">{secondary}</p>
      ) : null}
    </div>
  );
}

function SummarySkeletonRow() {
  return (
    <div className="flex flex-col border-b border-border/30 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="h-4 w-32 rounded-full bg-border/20 animate-pulse" />
        <div className="h-3 w-16 rounded-full bg-border/20 animate-pulse" />
      </div>
      <div className="mt-3 h-3 w-48 rounded-full bg-border/20 animate-pulse" />
    </div>
  );
}

function SectionSkeleton({ label }: { label: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">
        {label}
      </p>
      <div className="space-y-2 min-w-0">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-3 py-3 border-b border-border/40"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 bg-border/40 animate-pulse shrink-0" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-32 rounded-full bg-border/40 animate-pulse" />
                <div className="h-2 w-24 rounded-full bg-border/40 animate-pulse" />
              </div>
            </div>
            <div className="h-3 w-12 rounded-full bg-border/40 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LastFmPageContent() {
  const [period, setPeriod] = useState<Period>("7day");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"recent" | "artists" | "tracks" | "albums">(
    "recent",
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/lastfm?period=${period}`, { cache: "no-store" })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          throw new Error(body.error || "Unable to load Last.fm data");
        }
        return body as ApiResponse;
      })
      .then((payload) => {
        if (!cancelled) {
          setData(payload);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [period]);

  const user = data?.user ?? null;
  const recentTracks = data?.recentTracks ?? [];
  const topArtists = data?.topArtists ?? [];
  const topTracks = data?.topTracks ?? [];
  const topAlbums = data?.topAlbums ?? [];

  const displayRecentTracks = recentTracks.slice(0, 10);
  const displayTopArtists = topArtists.slice(0, 10);
  const displayTopTracks = topTracks.slice(0, 10);
  const displayTopAlbums = topAlbums.slice(0, 10);

  const topArtist = topArtists[0];
  const topTrack = topTracks[0];
  const topAlbum = topAlbums[0];

  return (
    <section className="py-12">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Last.fm</p>
        <h1 className="mt-2 text-2xl font-semibold">Top</h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {PERIODS.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => setPeriod(value)}
            className={`text-xs uppercase tracking-[0.15em] px-3 py-2 border transition-colors ${
              period === value
                ? "bg-foreground text-background border-foreground"
                : "border-border/50 text-muted hover:border-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <>
          <div className="space-y-0 mb-10">
            <SummarySkeletonRow />
            <SummarySkeletonRow />
            <SummarySkeletonRow />
            <SummarySkeletonRow />
          </div>

          <div className="flex lg:hidden mb-6 gap-2">
            {(
              [
                { id: "recent", label: "RECENT" },
                { id: "artists", label: "ARTISTS" },
                { id: "tracks", label: "TRACKS" },
                { id: "albums", label: "ALBUMS" },
              ] as const
            ).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`text-xs uppercase tracking-[0.15em] px-3 py-1 border transition-colors ${
                  tab === id
                    ? "bg-foreground text-background border-foreground"
                    : "border-border/60 text-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid gap-10 lg:grid-cols-4 min-w-0">
            <div
              className={`${tab !== "recent" ? "hidden lg:block" : ""} min-w-0`}
            >
              <SectionSkeleton label="Recent" />
            </div>
            <div
              className={`${tab !== "artists" ? "hidden lg:block" : ""} min-w-0`}
            >
              <SectionSkeleton label="Top Artists" />
            </div>
            <div
              className={`${tab !== "tracks" ? "hidden lg:block" : ""} min-w-0`}
            >
              <SectionSkeleton label="Top Tracks" />
            </div>
            <div
              className={`${tab !== "albums" ? "hidden lg:block" : ""} min-w-0`}
            >
              <SectionSkeleton label="Top Albums" />
            </div>
          </div>
        </>
      ) : error ? (
        <div className="text-xs uppercase tracking-[0.3em] text-muted">
          Try again later
        </div>
      ) : (
        <>
          <div className="space-y-0 mb-10">
            <SummaryRow
              label="Profile"
              value={user?.name ?? "Unknown user"}
              secondary={
                user
                  ? `${formatCount(user.playcount)}`
                  : "No user profile available"
              }
            />
            <SummaryRow
              label="Top artist"
              value={topArtist?.name ?? "No artist data"}
              secondary={
                topArtist ? `${formatCount(topArtist.playcount)}` : undefined
              }
            />
            <SummaryRow
              label="Top track"
              value={topTrack?.name ?? "No track data"}
              secondary={
                topTrack
                  ? `${topTrack.artist?.name || topTrack.artist?.["#text"] || ""}`
                  : undefined
              }
            />
            <SummaryRow
              label="Top album"
              value={topAlbum?.name ?? "No album data"}
              secondary={
                topAlbum
                  ? `${topAlbum.artist?.name || topAlbum.artist?.["#text"] || ""}`
                  : undefined
              }
            />
          </div>

          <div className="flex lg:hidden mb-6 gap-2">
            {(
              [
                { id: "recent", label: "RECENT" },
                { id: "artists", label: "ARTISTS" },
                { id: "tracks", label: "TRACKS" },
                { id: "albums", label: "ALBUMS" },
              ] as const
            ).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`text-xs uppercase tracking-[0.15em] px-3 py-1 border transition-colors ${
                  tab === id
                    ? "bg-foreground text-background border-foreground"
                    : "border-border/60 text-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid gap-10 lg:grid-cols-4 min-w-0">
            <div
              className={`${tab !== "recent" ? "hidden lg:block" : ""} min-w-0`}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">
                Recent
              </p>
              <div className="space-y-2 min-w-0">
                {displayRecentTracks.map((track, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 py-3 border-b border-border/40"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {getImage(track.image) ? (
                        <img
                          src={getImage(track.image)}
                          className="w-10 h-10 object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-border/40 shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm truncate">{track.name}</p>
                        <p className="text-xs text-muted truncate">
                          {track.artist?.name || track.artist?.["#text"]}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted whitespace-nowrap shrink-0">
                      {track["@attr"]?.nowplaying
                        ? "Now"
                        : track.date?.uts
                          ? timeAgo(track.date.uts)
                          : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className={`${tab !== "artists" ? "hidden lg:block" : ""} min-w-0`}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">
                Top Artists
              </p>
              <div className="space-y-2 min-w-0">
                {displayTopArtists.map((artist, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 py-3 border-b border-border/40"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {getImage(artist.image) ? (
                        <img
                          src={getImage(artist.image)}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-border/40 shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm truncate">{artist.name}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted whitespace-nowrap shrink-0">
                      {formatCount(artist.playcount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className={`${tab !== "tracks" ? "hidden lg:block" : ""} min-w-0`}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">
                Top Tracks
              </p>
              <div className="space-y-2 min-w-0">
                {displayTopTracks.map((track, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 py-3 border-b border-border/40"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {getImage(track.image) ? (
                        <img
                          src={getImage(track.image)}
                          className="w-10 h-10 object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-border/40 shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm truncate">{track.name}</p>
                        <p className="text-xs text-muted truncate">
                          {track.artist?.name || track.artist?.["#text"]}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted whitespace-nowrap shrink-0">
                      {formatCount(track.playcount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className={`${tab !== "albums" ? "hidden lg:block" : ""} min-w-0`}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">
                Top Albums
              </p>
              <div className="space-y-2 min-w-0">
                {displayTopAlbums.map((album, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 py-3 border-b border-border/40"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {getImage(album.image) ? (
                        <img
                          src={getImage(album.image)}
                          className="w-10 h-10 object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-border/40 shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm truncate">{album.name}</p>
                        <p className="text-xs text-muted truncate">
                          {album.artist?.name || album.artist?.["#text"]}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted whitespace-nowrap shrink-0">
                      {formatCount(album.playcount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

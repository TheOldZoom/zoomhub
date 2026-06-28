"use client";

import { useEffect, useRef, useState } from "react";
import { useLastFm } from "@/hooks/useLastFm";

function timeAgo(timestamp: string) {
  const now = Date.now();
  const then = parseInt(timestamp, 10) * 1000;
  const diff = Math.floor((now - then) / 1000);

  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(diff / 3600);
  const days = Math.floor(diff / 86400);

  if (diff < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
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

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-border/40">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 bg-border/40 animate-pulse" />
        <div className="space-y-2 min-w-0">
          <div className="h-3 w-32 bg-border/40 animate-pulse" />
          <div className="h-2 w-24 bg-border/40 animate-pulse" />
        </div>
      </div>
      <div className="h-2 w-10 bg-border/40 animate-pulse" />
    </div>
  );
}

export function LastFm() {
  const { recentTracks, topAlbums, topArtists, topTracks, loading } =
    useLastFm();

  const [visibleCount, setVisibleCount] = useState(10);
  const [tab, setTab] = useState<"recent" | "albums" | "artists" | "tracks">(
    "recent",
  );

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + 5);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const visibleTracks = recentTracks.slice(0, visibleCount);

  const skeletonMap = {
    recent: Array.from({ length: 8 }),
    tracks: Array.from({ length: 8 }),
    albums: Array.from({ length: 8 }),
    artists: Array.from({ length: 8 }),
  };

  return (
    <section className="py-12 relative">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          Listening
        </p>
        <p className="mt-2 text-xs text-muted">Weekly listening statistics</p>
      </div>

      <div className="flex lg:hidden mb-6 gap-2">
        {(["recent", "tracks", "albums", "artists"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs px-3 py-1 border transition ${
              tab === t
                ? "bg-foreground text-background"
                : "border-border/40 text-muted"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-10 lg:grid-cols-4">
          {(["recent", "tracks", "albums", "artists"] as const).map(
            (section) => (
              <div key={section} className="lg:block">
                <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">
                  {section}
                </p>
                {skeletonMap[section].map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-4">
          {/* RECENT */}
          <div className={`${tab !== "recent" ? "hidden lg:block" : ""}`}>
            <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">
              Recent
            </p>

            <div className="space-y-2">
              {visibleTracks.map((track: any, i: number) => {
                const image = getImage(track.image);

                return (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 py-3 border-b border-border/40"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {image ? (
                        <img
                          src={image}
                          className="w-10 h-10 object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-border/40 shrink-0" />
                      )}

                      <div className="min-w-0">
                        <p className="text-sm truncate">{track.name}</p>
                        <p className="text-xs text-muted truncate">
                          {track.artist?.["#text"]}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-muted whitespace-nowrap">
                      {track["@attr"]?.nowplaying
                        ? "Now"
                        : track.date?.uts
                          ? timeAgo(track.date.uts)
                          : ""}
                    </span>
                  </div>
                );
              })}

              <div ref={loadMoreRef} className="h-10" />
            </div>
          </div>

          {/* TRACKS */}
          <div className={`${tab !== "tracks" ? "hidden lg:block" : ""}`}>
            <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">
              Top Tracks
            </p>

            <div className="space-y-2">
              {topTracks.map((track: any, i: number) => {
                const image = getImage(track.image);

                return (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 py-3 border-b border-border/40"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {image ? (
                        <img
                          src={image}
                          className="w-10 h-10 object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-border/40 shrink-0" />
                      )}

                      <div className="min-w-0">
                        <p className="text-sm truncate">{track.name}</p>
                        <p className="text-xs text-muted truncate">
                          {track.artist?.name || track.artist?.["#text"]}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-muted whitespace-nowrap">
                      {Number(track.playcount || 0).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ALBUMS */}
          <div className={`${tab !== "albums" ? "hidden lg:block" : ""}`}>
            <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">
              Top Albums
            </p>

            <div className="space-y-2">
              {topAlbums.map((album: any, i: number) => {
                const image = getImage(album.image);

                return (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 py-3 border-b border-border/40"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {image ? (
                        <img
                          src={image}
                          className="w-10 h-10 object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-border/40 shrink-0" />
                      )}

                      <div className="min-w-0">
                        <p className="text-sm truncate">{album.name}</p>
                        <p className="text-xs text-muted truncate">
                          {album.artist?.name || album.artist?.["#text"]}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-muted whitespace-nowrap">
                      {Number(album.playcount || 0).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ARTISTS */}
          <div className={`${tab !== "artists" ? "hidden lg:block" : ""}`}>
            <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">
              Top Artists
            </p>

            <div className="space-y-2">
              {topArtists.map((artist: any, i: number) => {
                const image = getImage(artist.image);

                return (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 py-3 border-b border-border/40"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {image ? (
                        <img
                          src={image}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-border/40 shrink-0" />
                      )}

                      <p className="text-sm truncate">{artist.name}</p>
                    </div>

                    <span className="text-xs text-muted whitespace-nowrap">
                      {Number(artist.playcount || 0).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

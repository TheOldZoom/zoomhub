"use client";

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

export function LastFm() {
  const { tracks, loading } = useLastFm();

  return (
    <section className="py-12">
      <p className="text-xs uppercase tracking-[0.3em] text-muted mb-6">
        Listening
      </p>

      {loading && (
        <p className="text-sm text-muted">Loading recent activity...</p>
      )}

      <div className="space-y-2">
        {tracks.map((t: any, i: number) => {
          const image =
            t.image?.find((img: any) => img.size === "large")?.["#text"] ||
            t.image?.[0]?.["#text"];

          const playedAt = t.date?.uts;

          return (
            <div
              key={i}
              className={`flex items-center justify-between gap-4 py-4 hover:opacity-60 transition ${
                i === tracks.length - 1 ? "" : "border-b border-border/40"
              }`}
            >
              <div className="flex items-center gap-4">
                {image ? (
                  <img
                    src={image}
                    alt={t.name}
                    className="w-10 h-10 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-border/40" />
                )}

                <div>
                  <p className="text-sm">{t.name}</p>
                  <p className="text-xs text-muted">{t.artist?.["#text"]}</p>
                </div>
              </div>

              <span className="text-xs text-muted">
                {t["@attr"]?.nowplaying
                  ? "Now"
                  : playedAt
                    ? timeAgo(playedAt)
                    : ""}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

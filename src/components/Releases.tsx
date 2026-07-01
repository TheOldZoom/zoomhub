"use client";
import { useAlbums } from "@/hooks/useAlbums";
import Link from "next/link";
import { spotifyAccounts } from "./Footer";

export function Releases() {
  const albums = useAlbums();

  if (!albums || albums.length === 0) {
    return (
      <section className="py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-muted mb-6">
          Releases
        </p>
        <p className="text-sm text-muted">Couldn’t fetch releases</p>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="flex items-end justify-between mb-8 gap-4">
        <p className="text-xs uppercase tracking-[0.3em] text-muted mb-6">
          Releases
        </p>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={spotifyAccounts.find((a) => a.name === "Artist")?.url || "#"}
          className="text-[10px] uppercase tracking-[0.15em] text-muted hover:text-foreground transition"
        >
          View artist
        </Link>
      </div>

      <div className="space-y-2">
        {albums.map((a: any) => (
          <a
            key={a.id}
            href={a.external_urls.spotify}
            target="_blank"
            className="flex items-center justify-between gap-4 py-4 hover:opacity-60 transition border-b border-border/40"
          >
            <div className="flex items-center gap-4">
              <img
                src={a.images?.[0]?.url}
                alt={a.name}
                className="w-12 h-12 object-cover"
              />

              <div>
                <p className="text-sm">{a.name}</p>
                <p className="text-xs text-muted uppercase">{a.album_type}</p>
              </div>
            </div>

            <span className="text-xs text-muted">
              {a.release_date?.slice(0, 4)}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

"use client";
import { useAlbums } from "@/hooks/useAlbums";

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
      <p className="text-xs uppercase tracking-[0.3em] text-muted mb-6">
        Releases
      </p>

      <div className="space-y-2">
        {albums.map((a: any) => (
          <a
            key={a.id}
            href={a.external_urls.spotify}
            target="_blank"
            className="flex items-center justify-between gap-4 py-4 hover:opacity-60 transition"
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

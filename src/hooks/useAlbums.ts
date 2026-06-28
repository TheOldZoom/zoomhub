"use client";

import { useEffect, useState } from "react";

export function useAlbums() {
  const [albums, setAlbums] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/spotify/albums")
      .then((r) => r.json())
      .then((data) => {
        const sorted =
          data.items?.sort(
            (a: any, b: any) =>
              new Date(b.release_date).getTime() -
              new Date(a.release_date).getTime(),
          ) || [];

        setAlbums(sorted);
      });
  }, []);

  return albums;
}

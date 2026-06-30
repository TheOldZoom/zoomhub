import { useEffect, useState } from "react";

export function useLastFm() {
  const [data, setData] = useState<{
    recentTracks: any[];
    topAlbums: any[];
    topArtists: any[];
    topTracks: any[];
  }>({
    recentTracks: [],
    topAlbums: [],
    topArtists: [],
    topTracks: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/lastfm", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  return { ...data, loading };
}

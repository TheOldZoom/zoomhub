import { useEffect, useState } from "react";

export function useLastFm() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/lastfm")
      .then((r) => r.json())
      .then((data) => {
        setTracks(data?.recenttracks?.track || []);
        setLoading(false);
      });
  }, []);

  return { tracks, loading };
}

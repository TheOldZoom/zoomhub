import { useEffect, useState } from "react";

export interface ChessStats {
  username: string;
  profile: any;
  stats: any;
  recentGames: any[];
  byTimeClass: Record<
    string,
    { wins: number; losses: number; draws: number; total: number }
  >;
}

export function useChessCom() {
  const [data, setData] = useState<ChessStats>({
    username: "",
    profile: null,
    stats: null,
    recentGames: [],
    byTimeClass: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/chesscom")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { ...data, loading };
}

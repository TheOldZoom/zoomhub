"use client";

import { useEffect, useState } from "react";

export function useRepos() {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`/api/github`)
      .then((r) => r.json())
      .then((data) => {
        const sorted = (data || []).sort(
          (a: any, b: any) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        );

        setRepos(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  return { repos, loading };
}

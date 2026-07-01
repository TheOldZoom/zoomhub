"use client";
import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
interface JournalStarProps {
  slug: string;
  initialCount: number;
  initialAlreadyStarred: boolean;
}
export function JournalStar({
  slug,
  initialCount,
  initialAlreadyStarred,
}: JournalStarProps) {
  const [count, setCount] = useState(initialCount);
  const [starred, setStarred] = useState(initialAlreadyStarred);
  const [loading, setLoading] = useState(false);

  async function handleStar() {
    if (loading || starred) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/journal/${slug}`, { method: "POST" });
      const data = await res.json();
      if (res.status === 409) {
        setCount(data.count);
        setStarred(true);
        return;
      }
      if (!res.ok) return;
      setCount(data.count);
      setStarred(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleUnstar() {
    if (loading || !starred) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/journal/${slug}/reaction`, {
        method: "DELETE",
      });
      if (!res.ok) return;
      const data = await res.json();
      setCount(data.count);
      setStarred(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={starred ? handleUnstar : handleStar}
      disabled={loading}
      className={`flex items-center gap-1.5 border px-3 py-1.5 text-xs transition ${
        starred
          ? "border-foreground text-foreground"
          : "border-border/40 text-muted hover:text-foreground hover:border-foreground"
      } disabled:opacity-50`}
    >
      {starred ? (
        <FaStar className="w-3 h-3" />
      ) : (
        <FaRegStar className="w-3 h-3" />
      )}
      {count}
    </button>
  );
}

"use client";

import { useState } from "react";

export function WhatIsMyIpButton() {
  const [ip, setIp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleClick() {
    if (ip) {
      setIp(null);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/whatismyip");
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setIp(data.ip);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`text-xs px-3 py-1.5 border transition-colors border-border/50 text-muted hover:border-foreground hover:text-foreground disabled:opacity-50 align-middle ${
        ip
          ? "font-mono normal-case tracking-normal"
          : "uppercase tracking-[0.15em]"
      }`}
    >
      {loading
        ? "Looking up…"
        : error
          ? "Couldn't look it up"
          : ip
            ? ip
            : "What is my IP?"}
    </button>
  );
}

"use client";
import { useMemo, useState } from "react";
import { JournalBox } from "@/components/journal/journalBox";
import { JournalSearch } from "@/components/journal/JournalSearch";
import { JournalTagFilter } from "@/components/journal/JournalTagFilter";

interface JournalEntry {
  id: number;
  title: string;
  slug: string;
  publishedAt: Date | null;
  tags: { id: number; name: string }[];
  reactions: { id: string }[];
}

export function JournalList({
  journals,
  isAdmin = false,
}: {
  journals: JournalEntry[];
  isAdmin?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const availableTags = useMemo(() => {
    const seen = new Map<string, { id: number; name: string }>();
    for (const entry of journals) {
      for (const tag of entry.tags) {
        if (!seen.has(tag.name)) seen.set(tag.name, tag);
      }
    }
    return Array.from(seen.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [journals]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return journals.filter((entry) => {
      const matchesTag =
        activeTag === null || entry.tags.some((tag) => tag.name === activeTag);
      if (!matchesTag) return false;
      if (!q) return true;
      const titleMatch = entry.title.toLowerCase().includes(q);
      const tagMatch = entry.tags.some((tag) =>
        tag.name.toLowerCase().includes(q),
      );
      return titleMatch || tagMatch;
    });
  }, [journals, query, activeTag]);

  return (
    <>
      <JournalTagFilter
        tags={availableTags}
        activeTag={activeTag}
        onSelect={setActiveTag}
      />
      <div className="mb-6">
        <JournalSearch value={query} onChange={setQuery} />
      </div>
      <p className="text-[11px] text-muted mb-3">
        {filtered.length} entr{filtered.length === 1 ? "y" : "ies"}
        {query ? ` matching "${query}"` : ""}
      </p>
      {filtered.length === 0 ? (
        <p className="text-sm text-muted">
          {query || activeTag
            ? "No entries match your search."
            : "No journal entries yet."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry) => (
            <JournalBox key={entry.id} data={entry} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </>
  );
}

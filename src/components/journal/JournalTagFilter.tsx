"use client";

interface JournalTagFilterProps {
  tags: { id: number; name: string }[];
  activeTag: string | null;
  onSelect: (tag: string | null) => void;
}

export function JournalTagFilter({
  tags,
  activeTag,
  onSelect,
}: JournalTagFilterProps) {
  if (tags.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`text-xs px-3 py-1 border transition ${
          activeTag === null
            ? "bg-foreground text-background"
            : "border-border/40 text-muted"
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          type="button"
          key={tag.id}
          onClick={() => onSelect(tag.name)}
          className={`text-xs px-3 py-1 border transition ${
            activeTag === tag.name
              ? "bg-foreground text-background"
              : "border-border/40 text-muted"
          }`}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}

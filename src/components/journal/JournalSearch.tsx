"use client";

import { Search } from "lucide-react";

interface JournalSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function JournalSearch({ value, onChange }: JournalSearchProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search"
        className="w-full pl-8 pr-3 py-2 text-sm bg-transparent border border-border/40 focus:border-border outline-none"
      />
    </div>
  );
}

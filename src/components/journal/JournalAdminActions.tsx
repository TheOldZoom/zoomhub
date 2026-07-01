"use client";
import { useState, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";

interface JournalAdminActionsProps {
  slug: string;
  published: boolean;
}

export function JournalAdminActions({
  slug,
  published,
}: JournalAdminActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this journal entry? This cannot be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/journal/${slug}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/journal");
        router.refresh();
      } else {
        alert("Failed to delete entry.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleTogglePublish(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setBusy(true);
    try {
      const res = await fetch(`/api/journal/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to update entry.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="flex items-center gap-1"
      onClick={(e) => e.stopPropagation()}
    >
      <Link
        href={`/journal/${slug}/edit`}
        onClick={(e) => e.stopPropagation()}
        className="p-1.5 border border-border/40 hover:border-foreground hover:text-foreground transition text-muted"
        title="Edit"
      >
        <Pencil className="w-3 h-3" />
      </Link>
      <button
        type="button"
        onClick={handleTogglePublish}
        disabled={busy}
        className="p-1.5 border border-border/40 hover:border-foreground hover:text-foreground transition text-muted disabled:opacity-50"
        title={published ? "Unpublish" : "Publish"}
      >
        {published ? (
          <EyeOff className="w-3 h-3" />
        ) : (
          <Eye className="w-3 h-3" />
        )}
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        className="p-1.5 border border-border/40 hover:border-red-500 hover:text-red-500 transition text-muted disabled:opacity-50"
        title="Delete"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

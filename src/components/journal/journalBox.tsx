"use client";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { JournalAdminActions } from "./JournalAdminActions";

interface JournalBoxProps {
  title: string;
  slug: string;
  publishedAt: Date | null;
  tags: { id: number; name: string }[];
  reactions: { id: string }[];
}

export function JournalBox({
  data,
  isAdmin = false,
}: {
  data: JournalBoxProps;
  isAdmin?: boolean;
}) {
  const { title, slug, publishedAt, tags, reactions } = data;
  return (
    <div className="border border-border/40 flex h-full flex-col justify-between">
      <Link href={`/journal/${slug}`} className="hover:opacity-60 transition">
        <div className="p-5">
          <p className="text-sm font-semibold truncate" title={title}>
            {title}
          </p>
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-[9px] uppercase tracking-[0.14em] text-muted border border-border/40 px-2 py-0.5"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted px-5 py-3">
        <span>{publishedAt ? publishedAt.toLocaleDateString() : "Draft"}</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <FaStar className="w-3 h-3" />
            {reactions.length}
          </span>
          {isAdmin && (
            <JournalAdminActions slug={slug} published={Boolean(publishedAt)} />
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRepos } from "@/hooks/useRepos";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

export function Github() {
  const { repos, loading } = useRepos();

  return (
    <section className="py-12">
      <div className="flex items-end justify-between mb-8 gap-4">
        <p className="text-xs uppercase tracking-[0.3em] text-muted mb-6">
          Github
        </p>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/theoldzoom"
          className="text-[10px] uppercase tracking-[0.15em] text-muted hover:text-foreground transition"
        >
          View GitHub
        </Link>
      </div>

      {loading && <p className="text-sm text-muted">Loading repositories...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.map((repo: any) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            className="border border-border/40 p-4 hover:opacity-60 transition flex flex-col gap-3"
          >
            <div className="flex justify-between items-start">
              <p className="text-sm">{repo.name}</p>

              <span className="text-xs text-muted flex items-center gap-1">
                <FaStar className="w-3 h-3" />
                {repo.stargazers_count}
              </span>
            </div>

            <p className="text-xs text-muted uppercase tracking-wide">
              {repo.language || "Unknown"}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}

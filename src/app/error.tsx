"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center text-center py-32">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">500</p>
          <h1 className="mt-3 text-2xl font-semibold">Something broke.</h1>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-muted hover:text-foreground transition-colors"
          >
            <RotateCw className="w-3 h-3" />
            Try again
          </button>
        </div>
      </div>
    </section>
  );
}

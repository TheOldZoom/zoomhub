import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "404",
  description: "This page doesn't exist.",
};

export default function NotFound() {
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
          <p className="text-xs uppercase tracking-[0.3em] text-muted">404</p>
          <h1 className="mt-3 text-2xl font-semibold">Nothing here.</h1>
          <Link
            href="/"
            className="mt-6 text-[10px] uppercase tracking-[0.25em] text-muted hover:text-foreground transition-colors"
          >
            Take me home
          </Link>
        </div>
      </div>
    </section>
  );
}

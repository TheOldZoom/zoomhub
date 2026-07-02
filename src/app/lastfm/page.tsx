import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { LastFmPageContent } from "@/components/LastFmPageContent";

export const metadata: Metadata = {
  title: "Last.fm",
  description:
    "Xavier Zoom Boulanger's last.fm stats, including top artists, top albums, and top tracks.",
  alternates: {
    canonical: "/lastfm",
  },
  openGraph: {
    title: "Last.fm | Xavier Zoom Boulanger",
    description:
      "Xavier Zoom Boulanger's last.fm stats, including top artists, top albums, and top tracks.",
    url: "https://zoomhub.xyz/lastfm",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Last.fm | Xavier Zoom Boulanger",
    description:
      "Xavier Zoom Boulanger's last.fm stats, including top artists, top albums, and top tracks.",
  },
};

export default function LastFmPage() {
  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </Link>
      <LastFmPageContent />
    </div>
  );
}

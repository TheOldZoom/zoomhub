import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LastFmPageContent } from "@/components/LastFmPageContent";

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

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import sitemap from "@/app/sitemap";
import { getJournals } from "@/lib/journal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Site Map",
  description: "Every page on zoomhub, in one place.",
  alternates: {
    canonical: "/directory",
  },
};

const siteUrl = "https://zoomhub.xyz";

const labelOverrides: Record<string, string> = {
  "/": "Home",
  "/lastfm": "Last.fm",
  "/journal": "All entries",
};

function labelFromPath(path: string): string {
  if (labelOverrides[path]) return labelOverrides[path];
  const last = path.split("/").filter(Boolean).pop() ?? "";
  return last.charAt(0).toUpperCase() + last.slice(1);
}

interface SiteLink {
  href: string;
  label: string;
}

export default async function DirectoryPage() {
  const [entries, journals] = await Promise.all([sitemap(), getJournals()]);
  const titleBySlug = new Map(journals.map((j) => [j.slug, j.title]));

  const mainLinks: SiteLink[] = [];
  const journalLinks: SiteLink[] = [];

  for (const entry of entries) {
    const path = entry.url.replace(siteUrl, "") || "/";

    if (path.startsWith("/journal/")) {
      const slug = path.replace("/journal/", "");
      journalLinks.push({ href: path, label: titleBySlug.get(slug) ?? slug });
    } else if (path === "/journal") {
      journalLinks.unshift({ href: path, label: labelFromPath(path) });
    } else {
      mainLinks.push({ href: path, label: labelFromPath(path) });
    }
  }

  const sections: { title: string; links: SiteLink[] }[] = [
    { title: "Main", links: mainLinks },
    { title: "Journal", links: journalLinks },
    {
      title: "Site",
      links: [
        { href: "/privacy", label: "Privacy" },
        { href: "/rss.xml", label: "RSS" },
      ],
    },
  ];

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

        <h1 className="text-2xl font-semibold mb-10">Site map</h1>

        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-4">
                {section.title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground hover:text-muted transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

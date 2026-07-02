import { getJournalsForFeed } from "@/lib/journal";

const SITE_URL = "https://zoomhub.xyz";

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function markdownToPlainText(md: string) {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[#>*_`~-]/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function makeExcerpt(content: string, length = 200) {
  const plain = markdownToPlainText(content);
  return plain.length > length ? plain.slice(0, length).trim() + "…" : plain;
}

export async function GET() {
  const entries = await getJournalsForFeed();

  const items = entries
    .map((entry) => {
      const url = `${SITE_URL}/journal/${entry.slug}`;
      const pubDate = (entry.publishedAt ?? entry.updatedAt).toUTCString();
      const description = makeExcerpt(entry.content);

      return `
    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      ${description ? `<description>${escapeXml(description)}</description>` : ""}
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Journal | Xavier Zoom Boulanger</title>
    <link>${SITE_URL}/journal</link>
    <description>Xavier Zoom Boulanger's journal, where he shares his ideas, things he finds interesting, random thoughts, and vents.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

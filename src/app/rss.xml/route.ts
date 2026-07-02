import { getJournalsForFeed } from "@/lib/journal";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

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

async function markdownToHtml(md: string) {
  const result = await remark().use(remarkGfm).use(remarkHtml).process(md);
  return result.toString();
}

export async function GET() {
  const entries = await getJournalsForFeed();

  const items = await Promise.all(
    entries.map(async (entry) => {
      const url = `${SITE_URL}/journal/${entry.slug}`;
      const pubDate = (entry.publishedAt ?? entry.updatedAt).toUTCString();
      const description = makeExcerpt(entry.content);
      const html = await markdownToHtml(entry.content);
      const categories = (entry.tags ?? [])
        .map(
          (t: { name: string }) => `<category>${escapeXml(t.name)}</category>`,
        )
        .join("");

      return `
    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      ${categories}
      ${description ? `<description>${escapeXml(description)}</description>` : ""}
      <content:encoded><![CDATA[${html}]]></content:encoded>
    </item>`;
    }),
  );

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Journal | Xavier Zoom Boulanger</title>
    <link>${SITE_URL}/journal</link>
    <description>Xavier Zoom Boulanger's journal, where he shares his ideas, things he finds interesting, random thoughts, and vents.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items.join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

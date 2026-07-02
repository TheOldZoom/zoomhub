import { getJournalsForFeed } from "@/lib/journal";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
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

function absolutizeUrls(html: string) {
  return html.replace(/(src|href)="\/(?!\/)/g, `$1="${SITE_URL}/`);
}

function applyEmailSafeStyles(html: string) {
  const BG = "#e9e9e9";
  const FG = "#0a0a0a";
  const MUTED = "#6b6b6b";
  const BORDER = "#2a2a2a";
  const CODE_BG = "#d2d2d2";
  const PRE_BG = "#dadada";
  const FONT = `font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace;`;

  return html
    .replace(
      /<h1>/g,
      `<h1 style="${FONT} color:${FG}; font-weight:600; font-size:1.25rem; margin:1.75rem 0 0.75rem;">`,
    )
    .replace(
      /<h2>/g,
      `<h2 style="${FONT} color:${FG}; font-weight:600; font-size:1.1rem; margin:1.75rem 0 0.75rem;">`,
    )
    .replace(
      /<h3>/g,
      `<h3 style="${FONT} color:${FG}; font-weight:600; font-size:1rem; margin:1.75rem 0 0.75rem;">`,
    )
    .replace(
      /<h4>/g,
      `<h4 style="${FONT} color:${FG}; font-weight:600; font-size:0.9rem; margin:1.75rem 0 0.75rem;">`,
    )
    .replace(
      /<p>/g,
      `<p style="${FONT} color:${MUTED}; line-height:1.7; margin:0 0 1rem;">`,
    )
    .replace(/<strong>/g, `<strong style="color:${FG}; font-weight:600;">`)
    .replace(/<em>/g, `<em style="font-style:italic;">`)
    .replace(
      /<del>/g,
      `<del style="text-decoration:line-through; opacity:0.7;">`,
    )
    .replace(
      /<a /g,
      `<a style="color:${FG}; text-decoration:underline; text-decoration-color:${BORDER};" `,
    )
    .replace(
      /<ul>/g,
      `<ul style="${FONT} color:${MUTED}; line-height:1.7; margin:0 0 1rem; padding-left:1.25rem; list-style-type:disc;">`,
    )
    .replace(
      /<ol>/g,
      `<ol style="${FONT} color:${MUTED}; line-height:1.7; margin:0 0 1rem; padding-left:1.25rem; list-style-type:decimal;">`,
    )
    .replace(/<li>/g, `<li style="margin-bottom:0.35rem;">`)
    .replace(
      /<blockquote>/g,
      `<blockquote style="border-left:2px solid ${BORDER}; padding-left:1rem; margin:1.25rem 0; color:${MUTED}; font-style:italic;">`,
    )
    .replace(
      /<code>/g,
      `<code style="background:${CODE_BG}; color:${FG}; padding:0.15rem 0.4rem; font-size:0.8em; font-family:ui-monospace,Menlo,monospace;">`,
    )
    .replace(
      /<pre>/g,
      `<pre style="background:${PRE_BG}; border:1px solid ${BORDER}; padding:1rem; margin:0 0 1.25rem; overflow-x:auto;">`,
    )
    .replace(/<pre[^>]*><code[^>]*style="[^"]*"/g, (m) =>
      m.replace(
        /style="[^"]*"(?=[^<]*<\/code>)/,
        `style="background:none; padding:0; font-size:0.8rem; line-height:1.6; font-family:ui-monospace,Menlo,monospace;"`,
      ),
    )
    .replace(
      /<hr>/g,
      `<hr style="border:none; border-top:1px solid ${BORDER}; margin:2rem 0;">`,
    )
    .replace(
      /<img /g,
      `<img style="max-width:100%; height:auto; border:1px solid ${BORDER}; margin:1.25rem 0; display:block;" `,
    )
    .replace(
      /<table>/g,
      `<table style="width:100%; border-collapse:collapse; margin:0 0 1.25rem; font-size:0.85rem;">`,
    )
    .replace(
      /<th>/g,
      `<th style="border:1px solid ${BORDER}; padding:0.5rem 0.75rem; text-align:left; color:${FG}; font-weight:600; text-transform:uppercase; font-size:0.7rem; letter-spacing:0.05em;">`,
    )
    .replace(
      /<td>/g,
      `<td style="border:1px solid ${BORDER}; padding:0.5rem 0.75rem; text-align:left; color:${MUTED};">`,
    );
}

async function markdownToHtml(md: string) {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkHtml)
    .process(md);
  return result.toString();
}

function safeCdata(html: string) {
  return html.replace(/]]>/g, "]]]]><![CDATA[>");
}

export async function GET() {
  const entries = await getJournalsForFeed();

  const items = await Promise.all(
    entries.map(async (entry) => {
      const url = `${SITE_URL}/journal/${entry.slug}`;
      const imageUrl = `${url}/opengraph-image`;
      const pubDate = (entry.publishedAt ?? entry.updatedAt).toUTCString();
      const description = makeExcerpt(entry.content);

      let bodyHtml = await markdownToHtml(entry.content);
      bodyHtml = absolutizeUrls(bodyHtml);
      bodyHtml = applyEmailSafeStyles(bodyHtml);

      const headerImg = `<img src="${imageUrl}" alt="${escapeXml(
        entry.title,
      )}" style="max-width:100%; height:auto; display:block; margin:0 0 1.5em;" />`;

      const html = `${headerImg}${bodyHtml}`;

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
      <content:encoded><![CDATA[${safeCdata(html)}]]></content:encoded>
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

import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = "https://zoomhub.xyz";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const journals = await prisma.journal.findMany({
    where: { publishedAt: { not: null } },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
  });

  const journalUrls: MetadataRoute.Sitemap = journals.map((entry) => ({
    url: `${siteUrl}/journal/${entry.slug}`,
    lastModified: entry.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/chess`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/lastfm`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  return [...staticUrls, ...journalUrls];
}

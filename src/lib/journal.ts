import { prisma } from "./prisma";

function getSortDate(entry: { publishedAt: Date | null; updatedAt: Date }) {
  return entry.publishedAt ?? entry.updatedAt;
}

export async function getJournals() {
  const journals = await prisma.journal.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
      updatedAt: true,
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
      reactions: {
        select: {
          id: true,
        },
      },
    },
  });

  return journals
    .filter((entry) => entry.publishedAt !== null)
    .sort((a, b) => getSortDate(b).getTime() - getSortDate(a).getTime())
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      slug: entry.slug,
      publishedAt: entry.publishedAt,
      tags: entry.tags,
      reactions: entry.reactions,
    }));
}

export async function getAllJournalsForAdmin() {
  const journals = await prisma.journal.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
      updatedAt: true,
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
      reactions: {
        select: {
          id: true,
        },
      },
    },
  });

  return journals.sort(
    (a, b) => getSortDate(b).getTime() - getSortDate(a).getTime(),
  );
}

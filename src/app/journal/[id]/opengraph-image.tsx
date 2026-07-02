import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const journal = await prisma.journal.findUnique({
    where: { slug: id },
    select: {
      title: true,
      publishedAt: true,
      tags: { select: { name: true } },
    },
  });

  const title = journal?.title ?? "Journal";
  const tags = journal?.tags.map((t) => t.name) ?? [];
  const date = journal?.publishedAt
    ? journal.publishedAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // scale font size down for longer titles so it doesn't overflow
  const titleSize =
    title.length > 60
      ? 52
      : title.length > 36
        ? 68
        : title.length > 20
          ? 84
          : 92;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#e9e9e9",
        color: "#0a0a0a",
        padding: 72,
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "Geist, Inter, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <span
          style={{
            display: "flex",
            fontSize: 18,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#6b6b6b",
          }}
        >
          zoomhub.xyz/journal
        </span>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 1,
            background: "#2a2a2a",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        <span
          style={{
            display: "flex",
            fontSize: titleSize,
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: "-0.05em",
            maxWidth: 980,
          }}
        >
          {title}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #2a2a2a",
          paddingTop: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              style={{
                display: "flex",
                fontSize: 16,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#6b6b6b",
                border: "1px solid #2a2a2a",
                padding: "6px 14px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        {date && (
          <span
            style={{
              display: "flex",
              fontSize: 20,
              color: "#6b6b6b",
              whiteSpace: "nowrap",
            }}
          >
            {date}
          </span>
        )}
      </div>
    </div>,
    size,
  );
}

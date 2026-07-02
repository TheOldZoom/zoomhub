import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const COLORS = {
  background: "#e9e9e9",
  foreground: "#0a0a0a",
  muted: "#6b6b6b",
  border: "#2a2a2a",
};

async function loadJetBrainsMono(weight: 400 | 500 | 600 | 700) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@${weight}&display=swap`;
  const css = await fetch(cssUrl).then((res) => res.text());
  const fontUrlMatch = css.match(
    /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/,
  );

  if (!fontUrlMatch) {
    throw new Error(
      `Could not resolve JetBrains Mono woff/ttf url for weight ${weight}`,
    );
  }

  const fontData = await fetch(fontUrlMatch[1]).then((res) =>
    res.arrayBuffer(),
  );
  return fontData;
}

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

  const titleSize =
    title.length > 60
      ? 52
      : title.length > 36
        ? 68
        : title.length > 20
          ? 84
          : 92;

  const [regular, medium] = await Promise.all([
    loadJetBrainsMono(400),
    loadJetBrainsMono(500),
  ]);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: COLORS.background,
        color: COLORS.foreground,
        padding: 72,
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "JetBrains Mono",
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
            color: COLORS.muted,
          }}
        >
          zoomhub.xyz/journal
        </span>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 1,
            background: COLORS.border,
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
            letterSpacing: "-0.03em",
            maxWidth: 980,
            fontFamily: "JetBrains Mono",
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
          borderTop: `1px solid ${COLORS.border}`,
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
                color: COLORS.muted,
                border: `1px solid ${COLORS.border}`,
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
              color: COLORS.muted,
              whiteSpace: "nowrap",
            }}
          >
            {date}
          </span>
        )}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "JetBrains Mono",
          data: regular,
          weight: 400,
          style: "normal",
        },
        {
          name: "JetBrains Mono",
          data: medium,
          weight: 500,
          style: "normal",
        },
      ],
    },
  );
}

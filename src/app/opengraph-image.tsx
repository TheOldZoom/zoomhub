import { ImageResponse } from "next/og";

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

export default async function Image() {
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
          zoomhub.xyz
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
            fontSize: 92,
            fontWeight: 500,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            fontFamily: "JetBrains Mono",
          }}
        >
          Xavier
        </span>
        <span
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 500,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            fontFamily: "JetBrains Mono",
          }}
        >
          Zoom
        </span>
        <span
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 500,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            fontFamily: "JetBrains Mono",
          }}
        >
          Boulanger
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
            flexDirection: "column",
            gap: 6,
          }}
        >
          <span
            style={{
              display: "flex",
              fontSize: 16,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: COLORS.muted,
            }}
          >
            Developer
          </span>
          <span
            style={{
              display: "flex",
              fontSize: 16,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: COLORS.muted,
            }}
          >
            Photographer
          </span>
        </div>
        <span
          style={{
            display: "flex",
            fontSize: 20,
            color: COLORS.muted,
          }}
        >
          A Random Guy That Enjoys Life
        </span>
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

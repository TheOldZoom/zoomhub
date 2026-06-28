import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
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
          zoomhub.xyz
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
            fontSize: 92,
            fontWeight: 500,
            lineHeight: 0.95,
            letterSpacing: "-0.06em",
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
            letterSpacing: "-0.06em",
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
            letterSpacing: "-0.06em",
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
          borderTop: "1px solid #2a2a2a",
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
              color: "#6b6b6b",
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
              color: "#6b6b6b",
            }}
          >
            Photographer
          </span>
        </div>

        <span
          style={{
            display: "flex",
            fontSize: 20,
            color: "#6b6b6b",
          }}
        >
          A Random Guy That Enjoys Life
        </span>
      </div>
    </div>,
    size,
  );
}

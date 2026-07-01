import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Xavier Zoom Boulanger",
    short_name: "Xavier Zoom Boulanger",
    description: "Developer, Photographer, and a random guy that enjoys life.",
    start_url: "/",
    display: "standalone",
    background_color: "#e9e9e9",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/icon.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

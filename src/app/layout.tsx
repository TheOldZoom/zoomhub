import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Xavier Zoom Boulanger",
    template: "%s | Xavier Zoom Boulanger",
  },
  description: "Developer, Photograhper, and a random guy that enjoys life.",
  metadataBase: new URL("https://zoomhub.xyz"),

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    title: "Xavier Zoom Boulanger",
    description: "Developer, Photograhper, and a random guy that enjoys life.",
    url: "https://zoomhub.xyz",
    siteName: "Xavier Zoom Boulanger",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Xavier Zoom Boulanger",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Xavier Zoom Boulanger",
    description: "Developer, Photograhper, and a random guy that enjoys life.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

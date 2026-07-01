import type { Metadata } from "next";
import "./globals.css";
import { JetBrains_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import SessionProviderClient from "@/components/SessionProviderClient";
import Analytics from "@/components/Analytics";
import { KeepAndroidOpenBanner } from "@/components/KeepAndroidOpen";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Xavier Zoom Boulanger",
    template: "%s | Xavier Zoom Boulanger",
  },
  description: "Developer, Photographer, and a random guy that enjoys life.",
  metadataBase: new URL("https://zoomhub.xyz"),
  manifest: "/manifest",
  icons: [
    { rel: "icon", url: "/icon.svg" },
    { rel: "apple-touch-icon", url: "/icon.svg" },
  ],
  openGraph: {
    title: "Xavier Zoom Boulanger",
    description: "Developer, Photographer, and a random guy that enjoys life.",
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
    description: "Developer, Photographer, and a random guy that enjoys life.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetBrainsMono.className}>
      <body>
        <KeepAndroidOpenBanner />

        <main className="mx-auto max-w-5xl px-6 bg-background text-foreground min-h-screen flex flex-col">
          <SessionProviderClient>
            <Nav />
            <div className="flex-1">{children}</div>
            <Footer />
          </SessionProviderClient>
        </main>
        <Analytics />
      </body>
    </html>
  );
}

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

const siteUrl = "https://zoomhub.xyz";
const siteName = "Xavier Zoom Boulanger";
const siteDescription =
  "Developer, Photographer, and a random guy that enjoys life.";

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: "%s | Xavier Zoom Boulanger",
  },
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  manifest: "/manifest",
  icons: [
    { rel: "icon", url: "/icon.svg" },
    { rel: "apple-touch-icon", url: "/icon.svg" },
  ],
  keywords: [
    "Xavier Zoom Boulanger",
    "developer",
    "photographer",
    "software engineer",
    "journal",
    "blog",
  ],
  authors: [{ name: "Xavier Zoom Boulanger", url: siteUrl }],
  creator: "Xavier Zoom Boulanger",
  publisher: "Xavier Zoom Boulanger",
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName: siteName,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
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

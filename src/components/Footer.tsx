"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { FaLastfm } from "react-icons/fa";
import { FaXTwitter, FaInstagram, FaGithub, FaSpotify } from "react-icons/fa6";
export const spotifyAccounts = [
  {
    name: "Artist",
    url: "https://open.spotify.com/artist/4ztedRQMcTeNSIpu5A5STy",
  },
  {
    name: "Personal",
    url: "https://open.spotify.com/user/31f35f5kcsdxh3uvp65xqwno3i5u",
  },
];
export function Footer() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const socials = [
    {
      name: "X",
      url: "https://twitter.com/theoldzoom",
      icon: FaXTwitter,
    },
    {
      name: "Instagram",
      url: "https://instagram.com/itsxayv",
      icon: FaInstagram,
    },
    {
      name: "GitHub",
      url: "https://github.com/theoldzoom",
      icon: FaGithub,
    },
    {
      name: "Last.fm",
      url: "https://www.last.fm/user/theoldzoom",
      icon: FaLastfm,
    },
  ];
  return (
    <footer className="mt-12 border-t border-border/40 py-16">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em]">
            Xavier Zoom Boulanger
          </p>
          <a
            href="mailto:theoldzoom@proton.me"
            className="mt-2 block text-xs text-muted transition hover:text-foreground"
          >
            theoldzoom@proton.me
          </a>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-xs text-muted">A Random Guy That Enjoys Life</p>
            {status !== "loading" && (
              <>
                <span className="text-xs text-muted">·</span>
                {session ? (
                  <button
                    onClick={() => signOut()}
                    className="cursor-pointer text-xs text-muted transition hover:text-foreground"
                  >
                    Sign out
                  </button>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="text-xs text-muted transition hover:text-foreground"
                  >
                    Sign in
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6 text-muted">
          {socials.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-foreground"
              >
                <Icon className="h-6 w-6" />
              </a>
            );
          })}
          <div className="relative">
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex cursor-pointer items-center justify-center transition-colors duration-200 hover:text-foreground"
            >
              <FaSpotify className="h-6 w-6" />
            </button>
            {open && (
              <div className="absolute left-1/2 mt-2 flex min-w-35 -translate-x-1/2 flex-col gap-2 border border-border/40 bg-background p-3">
                {spotifyAccounts.map((acc) => (
                  <a
                    key={acc.name}
                    href={acc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted transition hover:text-foreground"
                  >
                    {acc.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>© {new Date().getFullYear()} · All rights reserved</span>
          <span>·</span>
          <Link href="/privacy" className="transition hover:text-foreground">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useState } from "react";
import { FaLastfm } from "react-icons/fa";
import { FaXTwitter, FaInstagram, FaGithub, FaSpotify } from "react-icons/fa6";

export function Footer() {
  const [open, setOpen] = useState(false);

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

  const spotifyAccounts = [
    {
      name: "Artist",
      url: "https://open.spotify.com/artist/4ztedRQMcTeNSIpu5A5STy",
    },
    {
      name: "Personal",
      url: "https://open.spotify.com/user/31f35f5kcsdxh3uvp65xqwno3i5u",
    },
  ];

  return (
    <footer className="py-16 mt-12 border-t border-border/40">
      <div className="flex flex-col gap-10 md:flex-row md:justify-between md:items-start">
        <div>
          <p className="text-sm tracking-[0.3em] uppercase">
            Xavier Zoom Boulanger
          </p>

          <a
            href="mailto:theoldzoom@proton.me"
            className="text-xs text-muted mt-2 block hover:text-foreground transition"
          >
            theoldzoom@proton.me
          </a>

          <p className="text-xs text-muted mt-2">
            A Random Guy That Enjoys Life
          </p>
        </div>

        <div className="flex gap-6 items-center text-muted">
          {socials.map((social) => {
            const Icon = social.icon;

            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors duration-200"
              >
                <Icon className="w-6 h-6" />
              </a>
            );
          })}

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center justify-center hover:text-foreground transition-colors duration-200 cursor-pointer"
            >
              <FaSpotify className="w-6 h-6" />
            </button>

            {open && (
              <div className="absolute mt-2 left-1/2 -translate-x-1/2 flex flex-col gap-2 border border-border/40 bg-background p-3 min-w-35">
                {spotifyAccounts.map((acc) => (
                  <a
                    key={acc.name}
                    href={acc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted hover:text-foreground transition"
                  >
                    {acc.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-xs text-muted">
          © {new Date().getFullYear()} · All rights reserved
        </div>
      </div>
    </footer>
  );
}

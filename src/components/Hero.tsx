"use client";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Hero() {
  const bio = `I am **Xavier Zoom Boulanger**, a **16-years-old French Canadian** and a **developer** who codes for fun. I build **open source projects**, **automation tools**, and **websites** like this.

I am self-taught and have been coding for about **${new Date().getFullYear() - 2019} years**. I have experience in **Typescript** & **Golang**.

Outside of coding, I am also trying to become a **photographer** and I enjoy listening to **music**, especially **Kanye West**. My favorite album is **Donda**. You can check out my photos on [Instagram](https://instagram.com/your-handle).

My family and I moved to **Costa Rica** in **2021**. I've met some **great people** there, and it has become a place I **genuinely appreciate**.

**To the people I have met: I love you more than I usually show. You all mean something to me.**`;

  return (
    <section className="pt-24 pb-16">
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted mb-6">
            About
          </p>
        </div>
        <Link
          href="/journal"
          className="text-[10px] uppercase tracking-[0.15em] text-muted hover:text-foreground transition"
        >
          View Journal
        </Link>
      </div>
      <div className="max-w-md">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => (
              <p className="mt-4 first:mt-6 text-sm text-muted leading-relaxed">
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <strong className="text-foreground font-semibold">
                {children}
              </strong>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-muted transition-colors underline underline-offset-4"
              >
                {children}
              </a>
            ),
          }}
        >
          {bio}
        </ReactMarkdown>
      </div>
    </section>
  );
}

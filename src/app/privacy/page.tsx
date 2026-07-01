import type { Metadata } from "next";
import { WhatIsMyIpButton } from "@/components/WhatIsMyIpButton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for zoomhub.xyz",
};

const LAST_UPDATED = "July 1, 2026";
const CONTACT_EMAIL = "theoldzoom@proton.me";

function SummaryRow({
  label,
  value,
  secondary,
}: {
  label: string;
  value: string;
  secondary?: string;
}) {
  return (
    <div className="flex flex-col border-b border-border/30">
      <div className="flex items-center justify-between py-3">
        <p className="text-sm">{label}</p>
        <span className="text-xs text-muted font-mono">{value}</span>
      </div>
      {secondary ? (
        <p className="px-0 pb-3 text-xs text-muted">{secondary}</p>
      ) : null}
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-6 border-b border-border/40">
      <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">
        {label}
      </p>
      <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
        {children}
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <section>
      <div className="mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Legal</p>
        <h1 className="mt-2 text-2xl font-semibold">Privacy Policy</h1>
        <p className="mt-2 text-xs text-muted">Last updated {LAST_UPDATED}</p>
      </div>

      <div className="space-y-0 mb-10">
        <SummaryRow
          label="What's collected"
          value="IP address, page views"
          secondary="Your IP is stored only when you react to a journal entry. Page views are tracked anonymously via a self-hosted Swetrix instance — no cookies, no raw IP storage, no third parties."
        />
        <SummaryRow
          label="Accounts"
          value="Owner only"
          secondary="Sign-in is used solely by the site owner to manage content. Visitors do not create accounts."
        />
        <SummaryRow
          label="Sharing"
          value="None"
          secondary="Your data is not sold or shared with third parties for marketing."
        />
        <SummaryRow
          label="Contact"
          value={CONTACT_EMAIL}
          secondary="Reach out with any questions or removal requests."
        />
      </div>

      <Section label="Overview">
        <p>
          This site is a small personal journal. This policy explains what
          little data is collected from visitors, why, and how long it's kept.
        </p>
      </Section>

      <Section label="Reactions & IP addresses">
        <p>
          When you react to a journal entry, your IP address is stored alongside
          that reaction. This is used only to prevent the same visitor from
          submitting duplicate reactions on the same entry — it is not used for
          tracking, analytics, or advertising.
        </p>
        <p>
          The IP address is deleted automatically if the reaction is removed
          (for example, if the journal entry it belongs to is deleted).
        </p>
      </Section>

      <Section label="Account sign-in">
        <p>
          This site uses third-party sign-in (OAuth) for the site owner's own
          administrative access. Visitors do not sign in and no visitor account
          data is created or stored.
        </p>
      </Section>

      <Section label="Analytics">
        <p>
          This site uses a self-hosted instance of{" "}
          <a
            href="https://swetrix.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Swetrix
          </a>{" "}
          for basic traffic analytics (pages viewed, referrers, device type, and
          approximate location). Because it's self-hosted, this data stays on
          the site owner's own infrastructure and is never sent to Swetrix or
          any third party. Swetrix is cookieless by design and doesn't use local
          storage or store raw IP addresses — your IP is combined with other
          request data to generate a temporary, one-way hash used only to avoid
          counting the same visit twice, and this hash cannot be reversed to
          identify you or your IP address.
        </p>
      </Section>

      <Section label="Last.fm data">
        <p>
          Listening data shown on the Last.fm page is fetched from the Last.fm
          public API and cached temporarily to reduce API calls. This data
          belongs to the site owner's own Last.fm account and isn't collected
          from visitors.
        </p>
      </Section>

      <Section label="Other integrations">
        <p>
          Chess.com, GitHub, and Spotify data shown on this site is the site
          owner's own public data (games, repositories, top albums). None of
          these integrations collect or process any information about visitors.
        </p>
      </Section>

      <Section label="Cookies">
        <p>
          This site does not use tracking or advertising cookies. Analytics (via
          Swetrix) are cookieless by design. Any cookies present are limited to
          what's required for the owner's sign-in session.
        </p>
      </Section>

      <Section label="Your rights">
        <p>
          If you'd like the IP address tied to a reaction you made removed,
          email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="underline underline-offset-2 hover:text-foreground"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          with your IP address and the journal entry it was used on, and it will
          be deleted.
        </p>
        <p>
          Not sure what your IP address is? <WhatIsMyIpButton />
        </p>
      </Section>

      <Section label="Changes">
        <p>
          This policy may be updated occasionally as the site changes. The "last
          updated" date above reflects the most recent revision.
        </p>
      </Section>
    </section>
  );
}

"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        type="button"
        onClick={() => signOut()}
        className="w-full border border-border/40 px-4 py-2 text-xs uppercase tracking-[0.15em] text-muted hover:border-foreground hover:text-foreground transition"
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn("discord")}
      className="w-full border border-border/40 px-4 py-2 text-xs uppercase tracking-[0.15em] text-muted hover:border-foreground hover:text-foreground transition"
    >
      Sign in with Discord
    </button>
  );
}

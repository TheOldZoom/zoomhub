"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        type="button"
        onClick={() => signOut()}
        className="ml-4 rounded-2xl border border-border/40 bg-background/5 px-4 py-2 text-sm font-medium text-muted hover:bg-foreground hover:text-background"
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn("discord")}
      className="ml-4 rounded-2xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400"
    >
      Sign in
    </button>
  );
}

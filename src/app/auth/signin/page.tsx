"use client";

import SignInButton from "@/components/SignInButton";

export default function SignInPage() {
  return (
    <section className="py-12">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Auth</p>
        <h1 className="mt-2 text-2xl font-semibold">Sign in</h1>
      </div>

      <div className="space-y-0 mb-10">
        <div className="flex flex-col border-b border-border/30">
          <div className="flex items-center justify-between py-3">
            <p className="text-sm">Access</p>
            <span className="text-xs text-muted font-mono">Discord</span>
          </div>
          <p className="px-0 pb-3 text-xs text-muted">
            Sign in with the authorised Discord account for this site.
          </p>
          <SignInButton />
        </div>
      </div>
    </section>
  );
}

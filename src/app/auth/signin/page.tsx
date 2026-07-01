"use client";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import SignInButton from "@/components/SignInButton";

export default function SignInPage() {
  return (
    <section className="py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </Link>
      <div className="max-w-md mx-auto">
        <div className="border border-border/40 p-8 flex flex-col items-center text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
            Admin
          </p>
          <h1 className="mt-2 text-xl font-semibold">Sign in</h1>

          <div className="mt-8 w-full">
            <SignInButton />
          </div>
        </div>
      </div>
    </section>
  );
}

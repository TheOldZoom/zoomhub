import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { JournalForm } from "@/components/admin/journalForm";

export default async function EditJournalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signin");
  }

  const { id } = await params;
  const journal = await prisma.journal.findUnique({
    where: { slug: id },
    select: {
      title: true,
      slug: true,
      content: true,
      publishedAt: true,
      tags: { select: { name: true } },
    },
  });

  if (!journal) {
    notFound();
  }

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>

        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Admin</p>
          <h1 className="mt-2 text-2xl font-semibold">Edit entry</h1>
        </div>

        <JournalForm
          mode="edit"
          initialData={{
            title: journal.title,
            slug: journal.slug,
            content: journal.content,
            published: journal.publishedAt !== null,
            tags: journal.tags.map((t) => t.name).join(", "),
          }}
        />
      </div>
    </section>
  );
}

"use client";
import { useState, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

const markdownComponents = {
  a: ({ href, children, ...props }: React.ComponentPropsWithoutRef<"a">) => (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  ),
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

interface JournalFormProps {
  mode?: "create" | "edit";
  initialData?: {
    title: string;
    slug: string;
    content: string;
    published: boolean;
    tags: string;
  };
}

export function JournalForm({
  mode = "create",
  initialData,
}: JournalFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const originalSlug = initialData?.slug ?? "";

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [content, setContent] = useState(initialData?.content ?? "");
  const [tags, setTags] = useState(initialData?.tags ?? "");
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"write" | "preview">("write");

  const contentRef = useRef<HTMLTextAreaElement>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleContentInput(e: React.FormEvent<HTMLTextAreaElement>) {
    setContent(e.currentTarget.value);
  }

  function switchToPreview() {
    if (contentRef.current) {
      setContent(contentRef.current.value);
    }
    setView("preview");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const latestContent = contentRef.current?.value ?? content;

    setSubmitting(true);
    setError(null);
    try {
      const url = isEdit ? `/api/journal/${originalSlug}` : "/api/journal";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          content: latestContent,
          published,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      router.push(`/journal/${data.journal.slug}`);
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const parsedTags = tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-[10px] uppercase tracking-[0.18em] text-muted mb-2">
          Title
        </label>
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-transparent border border-border/40 focus:border-border outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-[0.18em] text-muted mb-2">
          Slug
        </label>
        <input
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className="w-full px-3 py-2 text-sm bg-transparent border border-border/40 focus:border-border outline-none font-mono"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[10px] uppercase tracking-[0.18em] text-muted">
            Content (Markdown)
          </label>
          <div className="flex border border-border/40">
            <button
              type="button"
              onClick={() => setView("write")}
              className={`px-3 py-1 text-[10px] uppercase tracking-[0.15em] transition ${
                view === "write"
                  ? "bg-foreground text-background"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={switchToPreview}
              className={`px-3 py-1 text-[10px] uppercase tracking-[0.15em] transition border-l border-border/40 ${
                view === "preview"
                  ? "bg-foreground text-background"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        <textarea
          ref={contentRef}
          defaultValue={content}
          onInput={handleContentInput}
          rows={14}
          required
          className={`w-full px-3 py-2 text-sm bg-transparent border border-border/40 focus:border-border outline-none font-mono ${
            view === "write" ? "" : "hidden"
          }`}
        />

        {view === "preview" && (
          <div>
            <div className="mb-10 border-b border-border/40 pb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
                  Journal
                </p>
                <h1 className="mt-2 text-2xl font-semibold">
                  {title || "Untitled entry"}
                </h1>
              </div>
            </div>

            <div className="border border-border/40 p-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-4">
                Entry
              </p>
              <div className="journal-markdown text-sm leading-relaxed text-muted">
                {content.trim() ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    components={markdownComponents}
                  >
                    {content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-muted text-sm">
                    Nothing to preview yet — start writing.
                  </p>
                )}
              </div>
              <div className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between gap-4">
                {parsedTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {parsedTags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-border/40 px-3 py-1 text-xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span />
                )}
                <span className="text-xs text-muted font-mono whitespace-nowrap">
                  {published ? "Will publish" : "Draft"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-[0.18em] text-muted mb-2">
          Tags (comma separated)
        </label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="go, minecraft, portfolio"
          className="w-full px-3 py-2 text-sm bg-transparent border border-border/40 focus:border-border outline-none"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        {isEdit ? "Published" : "Publish immediately"}
      </label>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="border border-border/40 px-4 py-2 text-xs uppercase tracking-[0.15em] hover:border-foreground hover:text-foreground transition disabled:opacity-50"
      >
        {submitting ? "Saving..." : isEdit ? "Update entry" : "Save entry"}
      </button>
    </form>
  );
}

export default function JournalEntryLoading() {
  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="h-3 w-16 bg-border/30 animate-pulse" />
        </div>

        <div className="mb-10 border-b border-border/40 pb-6 flex items-start justify-between gap-4">
          <div>
            <div className="h-3 w-16 bg-border/30 animate-pulse mb-2" />
            <div className="h-8 w-72 bg-border/30 animate-pulse" />
          </div>
          <div className="h-8 w-16 border border-border/40 animate-pulse shrink-0" />
        </div>

        <div className="border border-border/40 p-6">
          <div className="h-3 w-14 bg-border/30 animate-pulse mb-4" />

          <div className="space-y-3">
            <div className="h-4 w-full bg-border/20 animate-pulse" />
            <div className="h-4 w-full bg-border/20 animate-pulse" />
            <div className="h-4 w-5/6 bg-border/20 animate-pulse" />
            <div className="h-4 w-full bg-border/20 animate-pulse" />
            <div className="h-4 w-2/3 bg-border/20 animate-pulse" />
          </div>

          <div className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between gap-4">
            <div className="flex gap-2">
              <div className="h-6 w-16 border border-border/30 animate-pulse" />
              <div className="h-6 w-14 border border-border/30 animate-pulse" />
            </div>
            <div className="h-3 w-20 bg-border/20 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function JournalsLoading() {
  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="h-3 w-16 bg-border/30 animate-pulse" />
        </div>

        <div className="mb-10">
          <div className="h-3 w-20 bg-border/30 animate-pulse mb-3" />
          <div className="h-8 w-24 bg-border/30 animate-pulse" />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-6 w-16 border border-border/40 animate-pulse"
            />
          ))}
        </div>

        <div className="mb-6">
          <div className="h-9 w-full border border-border/40 animate-pulse" />
        </div>

        <div className="h-3 w-20 bg-border/20 animate-pulse mb-3" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="border border-border/40 p-6 space-y-4">
              <div className="h-5 w-4/5 bg-border/30 animate-pulse" />
              <div className="flex flex-wrap gap-2">
                <div className="h-5 w-14 border border-border/30 animate-pulse" />
                <div className="h-5 w-10 border border-border/30 animate-pulse" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="h-3 w-16 bg-border/20 animate-pulse" />
                <div className="h-3 w-10 bg-border/20 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

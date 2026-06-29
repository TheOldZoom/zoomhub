export default function ChessLoading() {
  return (
    <main className="min-h-screen py-8 sm:py-12 px-5 lg:px-12 max-w-5xl mx-auto">
      <div className="h-3 w-16 bg-border/30 animate-pulse mb-10" />
      <div className="space-y-2 mb-10">
        <div className="h-2 w-12 bg-border/30 animate-pulse" />
        <div className="h-4 w-32 bg-border/30 animate-pulse" />
        <div className="h-3 w-48 bg-border/30 animate-pulse" />
      </div>
      <div className="grid gap-10 lg:grid-cols-2 mb-12">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-2 w-16 bg-border/30 animate-pulse" />
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="h-10 bg-border/20 animate-pulse" />
            ))}
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-12 bg-border/20 animate-pulse" />
        ))}
      </div>
    </main>
  );
}

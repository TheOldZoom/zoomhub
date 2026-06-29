import {
  type ChessActivity,
  formatDuration,
  PLAYED_TIME_CLASSES,
  TIME_CLASS_LABELS,
} from "@/lib/chesscom";

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30">
      <p className="text-sm">{label}</p>
      <span className="text-xs text-muted font-mono">{value}</span>
    </div>
  );
}

export function ChessActivity({
  activity,
  loading,
}: {
  activity: ChessActivity;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 bg-border/20 animate-pulse" />
        ))}
      </div>
    );
  }

  const { memberSince, totalGames, totalSeconds, wins, losses, draws, winRate, byTimeClass } =
    activity;

  return (
    <div>
      <StatRow label="Member since" value={memberSince ?? "—"} />
      <StatRow label="Games played" value={totalGames.toLocaleString()} />
      <StatRow label="Time played" value={formatDuration(totalSeconds)} />
      <StatRow
        label="Win rate"
        value={winRate != null ? `${winRate}%` : "—"}
      />
      <StatRow
        label="Record"
        value={`${wins}W / ${losses}L / ${draws}D`}
      />

      {PLAYED_TIME_CLASSES.map((tc) => {
        const data = byTimeClass[tc];
        if (!data || data.games === 0) return null;
        return (
          <StatRow
            key={tc}
            label={TIME_CLASS_LABELS[tc]}
            value={`${data.games} games · ${formatDuration(data.seconds)}`}
          />
        );
      })}
    </div>
  );
}

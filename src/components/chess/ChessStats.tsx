import {
  listAllTimeRecords,
  listRatings,
  PLAYED_TIME_CLASSES,
  TIME_CLASS_LABELS,
} from "@/lib/chesscom";

export function ChessRatings({ stats }: { stats: Record<string, any> | null }) {
  const ratings = listRatings(stats);

  if (ratings.length === 0) {
    return <p className="text-sm text-muted py-3">No ratings</p>;
  }

  return (
    <>
      {ratings.map(({ key, label, rating }) => (
        <div
          key={key}
          className="flex items-center justify-between py-3 border-b border-border/30"
        >
          <p className="text-sm">{label}</p>
          <span className="text-xs text-muted font-mono">
            {rating.toLocaleString()}
          </span>
        </div>
      ))}
    </>
  );
}

type RecordEntry = {
  key: string;
  label: string;
  wins: number;
  losses: number;
  draws: number;
};

export function ChessRecords({ records }: { records: RecordEntry[] }) {
  if (records.length === 0) {
    return <p className="text-sm text-muted py-3">No records</p>;
  }

  return (
    <>
      {records.map(({ key, label, wins, losses, draws }) => (
        <div
          key={key}
          className="flex items-center justify-between py-3 border-b border-border/30"
        >
          <p className="text-sm">{label}</p>
          <p className="text-[11px] font-mono text-muted">
            <span className="text-foreground font-medium">{wins}W</span>
            {" / "}
            {losses}L{" / "}
            {draws}D
          </p>
        </div>
      ))}
    </>
  );
}

export function monthlyRecords(
  byTimeClass: Record<
    string,
    { wins: number; losses: number; draws: number; total: number }
  >,
): RecordEntry[] {
  return PLAYED_TIME_CLASSES.filter((tc) => byTimeClass[tc]).map((tc) => ({
    key: tc,
    label: TIME_CLASS_LABELS[tc],
    wins: byTimeClass[tc].wins,
    losses: byTimeClass[tc].losses,
    draws: byTimeClass[tc].draws,
  }));
}

export function allTimeRecords(
  stats: Record<string, any> | null,
): RecordEntry[] {
  return listAllTimeRecords(stats);
}

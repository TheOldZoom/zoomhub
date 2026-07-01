import Link from "next/link";

export function Nav() {
  return (
    <header className="flex justify-between items-center py-8">
      <Link href="/" className="text-sm tracking-[0.3em] uppercase">
        Xavier Zoom Boulanger
      </Link>

      <span className="text-xs text-muted tracking-[0.2em] uppercase">
        A random guy that enjoys life
      </span>
    </header>
  );
}

Required Supabase table:
create table if not exists public.lastfm_cache (
key text primary key,
value jsonb not null,
expires_at timestamptz not null
);

SQL table definition for Supabase:
create table if not exists lastfm_cache (
key text primary key,
value jsonb not null,
expires_at timestamptz not null
);

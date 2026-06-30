import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase config");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  global: { fetch },
});

export type SupabaseCacheValue = string | { miss?: true } | any;

export async function readCache(key: string) {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("lastfm_cache")
    .select("value")
    .eq("key", key)
    .gt("expires_at", now)
    .single();

  if (error) {
    //@ts-ignore
    if (error.status === 406) {
      return null;
    }
    console.error("Supabase cache read failed", error);
    return null;
  }

  return data?.value ?? null;
}

export async function writeCache(
  key: string,
  value: SupabaseCacheValue,
  ttl: number,
) {
  const expires_at = new Date(Date.now() + ttl).toISOString();

  const { error } = await supabase
    .from("lastfm_cache")
    .upsert({ key, value, expires_at }, { onConflict: "key" });

  if (error) {
    console.error("Supabase cache write failed", error);
  }
}

import { supabaseAdmin } from "@/server/supabase/supabase.admin"
import { Anime } from "@/types/anime"

export async function getAnimeByMalId(malId: number) {
  return supabaseAdmin
    .from("animes")
    .select("*")
    .eq("mal_id", malId)
    .maybeSingle<Anime>()
}

export async function getAnimeSuggestions() {
    return supabaseAdmin
    .from("v_anime_and_reviews_count")
    .select("*")
    .order("mal_rank", { ascending: true })
    .limit(20)
}

export async function upsertAnime(payload: Partial<Anime>) {
  return supabaseAdmin
    .from("animes")
    .upsert(payload, { onConflict: "mal_id" })
}

import { supabaseAdmin } from "@/server/supabase/supabase.admin"
import { Anime } from "@/types/anime"
import { ReviewPayload } from "@/types/review"

export async function getAnimeByMalId(malId: number) {
  const { data, error } = await supabaseAdmin
    .from("v_anime_and_reviews_count")
    .select("*")
    .eq("mal_id", malId)
    .maybeSingle<Anime>()
  if (error) {
    return { ok: false, error }
  }
  return { ok: true, data }
}
export async function getAnimeSuggestions() {
  const { data, error } = await supabaseAdmin
    .from("v_anime_and_reviews_count")
    .select("*")
    .order("mal_rank", { ascending: true })
    .limit(20)
  if (error) {
    return { ok: false, error }
  }
  return { ok: true, data }
}
export async function upsertAnime(payload: Partial<Anime>) {
  const { data, error } = await supabaseAdmin
    .from("animes")
    .upsert(payload, { onConflict: "mal_id" })
  if (error) {
    return { ok: false, error }
  }
  return { ok: true, data }
}
export async function insertReview(payload: ReviewPayload) {
  const { data, error } = await supabaseAdmin.
    from('reviews')
    .insert({
      mal_id: payload.mal_id,
      content: payload.content,
      reviewer_id: payload.reviewer_id,
    })
    .select()
    .single()
  if (error) {
    return { ok: false, error }
  }
  return { ok: true, data }
}
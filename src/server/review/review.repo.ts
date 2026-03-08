import { supabaseAdmin } from "@/server/supabase/supabase.admin"
import { RawReviewAndAnimeResult } from "@/types/admin-page"
import { Review } from "@/types/review"


export async function getReviewsByMalId(malId: number) {
    return supabaseAdmin
        .from("v_reviews_and_reviewer")
        .select("*")
        .eq("mal_id", malId)
        .returns<Review[]>()
}

export async function getReviewsByUserId(userId: string) {
    return supabaseAdmin
        .from('v_reviews_and_its_anime')
        .select('*')
        .eq("review_reviewer_id", userId)
        .returns<RawReviewAndAnimeResult[]>()
}
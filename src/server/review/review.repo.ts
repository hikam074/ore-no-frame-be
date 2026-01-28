import { supabaseAdmin } from "@/server/supabase/supabase.admin"
import { Review } from "@/types/review"


export async function getReviewsByMalId(malId: number) {
    return supabaseAdmin
        .from("reviews")
        .select("*")
        .eq("mal_id", malId)
        .returns<Review[]>()
}

export async function getAllReviews() {
    return supabaseAdmin
        .from('reviews')
        .select('*')
}
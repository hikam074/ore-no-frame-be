import { fetchMAL } from "../mal/mal.fetcher"
import { supabaseAdmin } from "../supabase/supabase.admin"
import { mapMALToSource, shouldUpdateSource } from "../utils"

export async function lazyUpdateSource(source_type: string, mal_id: number, updated_at?: string, source_id?: string) {
    if (!shouldUpdateSource(updated_at)) {
        console.log("[LOG] Source up-to-date")
        return
    }

    console.log("[LOG] Fetching MAL...")

    const mal = await fetchMAL(source_type, mal_id)
    if (!mal) {
        console.log("[LOG] MAL fetch failed")
        return
    }

    const payload = {
        id: source_id,
        ...mapMALToSource(mal)
    }

    const { error } = await supabaseAdmin
        .from("sources")
        .upsert(payload)

    if (error) {
        console.log(`[LOG] Supabase update error: ${error.message}`)
    } else {
        console.log("[LOG] Source updated")
    }
}
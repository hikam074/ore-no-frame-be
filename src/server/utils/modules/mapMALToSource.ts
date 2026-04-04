import { MALResponse } from "@/types"

export function mapMALToSource(mal: MALResponse) {
    let month: string | null = null
    if (mal.start_date) {
        const date = new Date(mal.start_date)
        month = date.toLocaleString("en-US", { month: "long" }) // "June"
    }
    return {
        mal_id: mal.id,
        title: mal.title,
        title_en: mal.alternative_titles?.en ?? null,
        title_ja: mal.alternative_titles?.ja ?? null,
        image_url: mal.main_picture?.large ?? null,
        media_type: mal.media_type,
        mal_score: mal.mean ?? null,
        mal_rank: mal.rank ?? null,
        season: mal.start_season?.season ?? null,
        year: mal.start_season?.year ?? null,
        month,
        genres: mal.genres?.map(g => g.name) ?? [],
        studios: mal.studios?.map(s => s.name) ?? [],
        author_name: mal.authors?.map(a => a.node.name) ?? [],
        updated_at: new Date().toISOString(),
    }
}
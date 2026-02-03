import { Anime } from "@/types/anime";
import { AnimeDetailData, AnimeDetailPageResponse } from "@/types/anime-page";
import { MALAnime } from "@/types/mal";
import { Review } from "@/types/review";

export function mapMALtoAnime(
    mal: MALAnime,
    extra: {
        reviews_count: number
        created_at: string
        updated_at: string
    }): Anime {
    return {
        mal_id: mal.id,
        title: mal.title,
        image_url: mal.main_picture?.large ?? "",
        media_type: mal.media_type ?? "unknown",
        season: mal.start_season?.season ?? "unknown",
        year: mal.start_season?.year ?? 0,
        mal_score: mal.mean ?? 0,
        mal_rank: mal.rank ?? 0,
        reviews_count: extra.reviews_count,
        created_at: extra.created_at,
        updated_at: extra.updated_at,
    }
}
export function mapAnimeToAnimeDetail(
    anime: Anime,
    mal: MALAnime
): AnimeDetailData {
    return {
        ...anime,
        title_ja: mal.alternative_titles?.ja ?? '',
        title_en: mal.alternative_titles?.en ?? '',
        
        studios: mal.studios?.map(s => s.name) ?? [],
        genres: mal.genres?.map(s => s.name) ?? [],
        synopsis: mal.synopsis ?? '',
    }
}
export function mapAnimeDetailToAnimeDetailResponse(
    anime: AnimeDetailData,
    animeReviews: Review[]
): AnimeDetailPageResponse {
    return {
        metadata: anime,
        reviews: animeReviews
    }
}
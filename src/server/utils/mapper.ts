import { AnimeSearchResult, RawReviewAndAnimeResult, ReviewAndAnimeResult } from "@/types/admin-page";
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
export function mapMALtoSearchResult(mal: MALAnime): AnimeSearchResult {
    return {
        mal_id: mal.id,
        title: mal.title,
        title_en: mal.alternative_titles?.en ?? "",
        image_url: mal.main_picture?.large ?? "",
        media_type: mal.media_type ?? "unknown",
        year: mal.start_season?.year ?? 0
    }
}
export function mapRawToReviewAndAnimeResult(p: RawReviewAndAnimeResult): ReviewAndAnimeResult {
    return {
        id: p.review_id,
        mal_id: p.mal_id,
        content: p.review_content,
        personal_score: p.review_personal_score,
        published: p.review_published,
        reviewer_name: p.review_reviewer_name,
        reviewer_id: p.review_reviewer_id,
        created_at: p.review_created_at,
        updated_at: p.review_updated_at,
        anime: {
            mal_id: p.mal_id,
            title: p.anime_title,
            image_url: p.anime_image_url,
            media_type: p.anime_media_type,
            season: p.anime_season,
            year: p.anime_year,
            mal_score: p.anime_mal_score,
            mal_rank: p.anime_mal_rank
        }
    }
}
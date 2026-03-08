import { Anime } from "./anime"
import { AnimeDetailData } from "./anime-page"
import { Review } from "./review"

export type AnimeSearchResult = Pick<AnimeDetailData,
  'mal_id' |
  'title' |
  'title_en' |
  'image_url' |
  'media_type' |
  'year'
>
export type AnimeReviewPayload = Pick<Review,
  'mal_id' |
  'content' |
  'personal_score' |
  'published' |
  // 'reviewer_id' | // mau diganti jwt
  'created_at' |
  'updated_at'
>
// dashboard/reviews
export type ReviewAndAnimeResult = Review & {
  anime: Pick<Anime,
  'mal_id' |
  'title' |
  'image_url' |
  'media_type' |
  'season' |
  'year' | 
  'mal_score' |
  'mal_rank'
  >
}
export type RawReviewAndAnimeResult = {
  review_id: string,
  mal_id: number,
  review_content: string,
  review_personal_score: number | null,
  review_published: boolean,
  review_reviewer_name: string,
  review_reviewer_id: string,
  review_created_at: string,
  review_updated_at: string,
  anime_title: string,
  anime_image_url: string,
  anime_media_type: string,
  anime_season: string,
  anime_year: number,
  anime_mal_score: number,
  anime_mal_rank: number,
}
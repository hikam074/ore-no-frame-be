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
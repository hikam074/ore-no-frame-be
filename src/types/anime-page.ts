import { Review } from "@/types/review"
import { Anime } from "@/types/anime"

export type AnimeDetailData = Anime & {  
  title_ja: string
  title_en: string
  studios: string[]
  genres: string[]
  synopsis: string
}
export type AnimeDetailPageResponse = {
  metadata: AnimeDetailData
  reviews: Review[]
}
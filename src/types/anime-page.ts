import { MALAnime } from "@/types/mal"
import { Review } from "@/types/review"
import { Anime } from "@/types/anime"

export type AnimePageData = {
  mal: MALAnime
  reviews: Review[]
  dbAnime: Anime | null
}

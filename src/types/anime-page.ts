import { MALAnime } from "../../srcc/types/mal"
import { Review } from "./review"
import { Anime } from "../../srcc/types/anime"

export type AnimePageData = {
  mal: MALAnime
  reviews: Review[]
  dbAnime: Anime | null
}

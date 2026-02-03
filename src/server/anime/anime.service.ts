import { getAnimeByMalId, upsertAnime } from "@/server/anime/anime.repo"
import { getReviewsByMalId } from "@/server/review/review.repo"
import { fetchMALAnime } from "@/server/mal/mal.client"
import { shouldUpdateAnime } from "@/server/utils/shouldUpdateAnime"
import { AnimeDetailPageResponse } from "@/types/anime-page"
import { mapAnimeDetailToAnimeDetailResponse, mapAnimeToAnimeDetail, mapMALtoAnime } from "../utils/mapper"

export async function getAnimeDetailData(
  malId: number
): Promise<AnimeDetailPageResponse | null> {

  const [malRes, animeRes, reviewsRes] = await Promise.all([
    fetchMALAnime(malId),
    getAnimeByMalId(malId),
    getReviewsByMalId(malId),
  ])

  if (!malRes) return null
  const mal = malRes
  const dbAnime = animeRes.data ?? null
  const reviews = reviewsRes.data ?? []

  const anime = mapMALtoAnime(mal, {
    reviews_count: dbAnime?.reviews_count ?? 0,
    created_at: dbAnime?.created_at ?? '-',
    updated_at: dbAnime?.updated_at ?? '-',
  })
  const animeDetail = mapAnimeToAnimeDetail(anime, mal)

  const res = mapAnimeDetailToAnimeDetailResponse(animeDetail, reviews)

  if (shouldUpdateAnime(dbAnime)) {
    const req = await upsertAnime({
      mal_id: mal.id,
      title: mal.title,
      image_url: mal.main_picture?.large,
      media_type: mal.media_type,
      mal_score: mal.mean,
      season: mal.start_season?.season,
      year: mal.start_season?.year,
      mal_rank: mal.rank,
      updated_at: new Date().toISOString(),
    })
    console.log(`[LOG] LazyUpdateSupa : (${req.status}) ${req.statusText}`)
  } else {
    console.log(`[LOG] LazyUpdateSupa : Data is already up-to-date`)
  }

  return res
}

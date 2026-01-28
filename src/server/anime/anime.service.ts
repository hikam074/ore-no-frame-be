import { getAnimeByMalId, upsertAnime } from "@/server/anime/anime.repo"
import { getReviewsByMalId } from "@/server/review/review.repo"
import { fetchMALAnime } from "@/server/mal/mal.client"
import { shouldUpdateAnime } from "@/server/utils/shouldUpdateAnime"
import { AnimePageData } from "@/types/anime-page"

export async function getAnimeDetailData(
  malId: number
): Promise<AnimePageData | null> {

  const [mal, animeRes, reviewsRes] = await Promise.all([
    fetchMALAnime(malId),
    getAnimeByMalId(malId),
    getReviewsByMalId(malId),
  ])

  if (!mal) return null

  const dbAnime = animeRes.data ?? null
  const reviews = reviewsRes.data ?? []

  if (shouldUpdateAnime(dbAnime)) {
    const res = await upsertAnime({
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
    console.log(`[LOG] LazyUpdateSupa : (${res.status}) ${res.statusText}`)
  } else {
    console.log(`[LOG] LazyUpdateSupa : Data is already up-to-date`)
  }

  return { mal, dbAnime, reviews }
}

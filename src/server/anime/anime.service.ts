import { getAnimeByMalId, insertReview, upsertAnime } from "@/server/anime/anime.repo"
import { getReviewsByMalId } from "@/server/review/review.repo"
import { fetchMALAnime, fetchSearchMALAnime } from "@/server/mal/mal.client"
import { shouldUpdateAnime } from "@/server/utils/shouldUpdateAnime"
import { AnimeDetailPageResponse } from "@/types/anime-page"
import { mapAnimeDetailToAnimeDetailResponse, mapAnimeToAnimeDetail, mapMALtoAnime, mapMALtoSearchResult } from "../utils/mapper"
import { AnimeSearchResult } from "@/types/admin-page"
import { ReviewPayload } from "@/types/review"
import { Result, AppError } from "@/types/result"

export async function getAnimeDetailData(malId: number): Promise<Result<AnimeDetailPageResponse | null, AppError>> {

  const [malRes, animeRes, reviewsRes] = await Promise.all([
    fetchMALAnime(malId),
    getAnimeByMalId(malId),
    getReviewsByMalId(malId),
  ])

  if (!malRes) return { ok: false, error: { type: 'NOT_FOUND', message: 'Anime not found in MAL' } }
  const dbAnime = animeRes.data ?? null
  const reviews = reviewsRes.data ?? []

  const anime = mapMALtoAnime(malRes, {
    reviews_count: dbAnime?.reviews_count ?? 0,
    created_at: dbAnime?.created_at ?? '-',
    updated_at: dbAnime?.updated_at ?? '-',
  })
  const animeDetail = mapAnimeToAnimeDetail(anime, malRes)

  const res = mapAnimeDetailToAnimeDetailResponse(animeDetail, reviews)

  if (shouldUpdateAnime(dbAnime)) {
    const req = await upsertAnime({
      mal_id: malRes.id,
      title: malRes.title,
      image_url: malRes.main_picture?.large,
      media_type: malRes.media_type,
      mal_score: malRes.mean,
      season: malRes.start_season?.season,
      year: malRes.start_season?.year,
      mal_rank: malRes.rank,
      updated_at: new Date().toISOString(),
    })
    if (!req.ok) {
      console.log(`[LOG] LazyUpdateSupa : (${req.error?.code}) ${req.error?.message}`)
    }
    console.log(`[LOG] LazyUpdateSupa : (204) OK`)
  } else {
    console.log(`[LOG] LazyUpdateSupa : Data is already up-to-date`)
  }
  return { ok: true, data: res }
}
export async function getAnimeSearchByName(q: string): Promise<Result<AnimeSearchResult[] | null, AppError>> {
  // cari data di mal
  const malResult = await fetchSearchMALAnime(q)
  if (!malResult) return { ok: true, data: null }
  // mapping mal raw to type
  const res = malResult.map(m => mapMALtoSearchResult(m))
  return { ok: true, data: res }
}
export async function postReview(payload: ReviewPayload): Promise<Result<unknown, AppError>> {
  // validate : searching in mal
  const animeMalExist = await fetchMALAnime(payload.mal_id)
  if (!animeMalExist) return { ok: false, error: { type: 'NOT_FOUND', message: 'Anime not found in MAL' } }
  // validate : searching in dbAnime
  const animeDbExist = await getAnimeByMalId(payload.mal_id)
  const dbAnime = animeDbExist.data ?? null

  // insert anime first if not exist
  if (shouldUpdateAnime(dbAnime)) {
    const animeInsert = await upsertAnime({
      mal_id: animeMalExist.id,
      title: animeMalExist.title,
      image_url: animeMalExist.main_picture?.large,
      media_type: animeMalExist.media_type,
      mal_score: animeMalExist.mean,
      season: animeMalExist.start_season?.season,
      year: animeMalExist.start_season?.year,
      mal_rank: animeMalExist.rank,
      updated_at: new Date().toISOString(),
    })
    if (!animeInsert.ok) {
      console.log(`[LOG] LazyUpdateSupa : (${animeInsert.error?.code}) ${animeInsert.error?.message}`)
    }
    console.log(`[LOG] LazyUpdateSupa : (204) OK`)
  } else {
    console.log(`[LOG] LazyUpdateSupa : Data is already up-to-date`)
  }

  // insert review
  const res = await insertReview(payload)
  // insert failed
  if (!res.ok) {
    return { ok: false, error: { type: 'DB_ERROR', code: res.error?.code } }
  }
  // insert success
  return { ok: true, data: res.data }
}
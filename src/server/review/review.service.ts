import { ReviewAndAnimeResult } from "@/types/admin-page"
import { Result, AppError } from "@/types/result"

import { mapRawToReviewAndAnimeResult } from "../utils/mapper"
import { getReviewsByUserId } from "./review.repo"

export async function getReviewsByUser(id: string): Promise<Result<ReviewAndAnimeResult[] | null, AppError>> {
  // cari data di mal
  const {data, error} = await getReviewsByUserId(id)
  if (!data) return { ok: true, data: null }
  if (error) return { ok: false, error: error}
  // mapping mal raw to type
  const res = data.map(m => mapRawToReviewAndAnimeResult(m))
  return { ok: true, data: res }
}
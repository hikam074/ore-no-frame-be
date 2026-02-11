import { getAnimeSuggestions } from "@/server/anime/anime.repo"
import { jsonResWithCors } from "@/server/http/response"

export const runtime = "edge"

export async function GET() {
  const res = await getAnimeSuggestions()
  if (!res.ok) {
    return jsonResWithCors({
      success: false,
      error: res.error?.message,
      data: undefined
    }, 500)
  }
  return jsonResWithCors({
    success: true,
    message: 'Anime suggestions retrieved successfully',
    data: res.data ?? []
  }, 200)
}

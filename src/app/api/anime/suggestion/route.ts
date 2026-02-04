import { getAnimeSuggestions } from "@/server/anime/anime.repo"
import { jsonResWithCors } from "@/server/http/response"

export const runtime = "edge"

export async function GET() {
  const { data } = await getAnimeSuggestions()

  return jsonResWithCors({
    success: true,
    message: 'Anime suggestions retrieved successfully',
    data: data ?? []
  }, 200)
}

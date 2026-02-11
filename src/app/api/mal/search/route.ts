import { getAnimeSearchByName } from "@/server/anime/anime.service"
import { jsonResWithCors } from "@/server/http/response"

export const runtime = "edge"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")

  if (!q || q.length < 3) {
    return jsonResWithCors(
      { error: "Query parameter q is required/too short" },
      400
    )
  }

  const res = await getAnimeSearchByName(q)

  if (!res.ok) {
    return jsonResWithCors({ 
      success: true, 
      message: "None anime can be found", 
      data: null 
    }, 200)
  }

  return jsonResWithCors({
    success: true,
    message: 'Anime(s) retrieved successfully',
    data: res.data
  }, 200)
}
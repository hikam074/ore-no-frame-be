import { MALAnime } from "@/types/mal"

const BASE_URL = "https://api.myanimelist.net/v2"

export async function fetchMALAnime(malId: number): Promise<MALAnime | null> {
  const res = await fetch(
    `${BASE_URL}/anime/${malId}?fields=title,main_picture,alternative_titles,synopsis,media_type,mean,rank,start_season,studios,genres`,
    {
      headers: {
        "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID!,
      },
      next: { revalidate: 3600 },
    }
  )

  if (!res.ok) return null
  return res.json()
}

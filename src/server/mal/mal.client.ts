import { MALAnime, MALSearchResponse } from "@/types/mal"

const reqLimit = 5
export async function fetchMALAnime(malId: number): Promise<MALAnime | null> {
  const res = await fetch(
    `${process.env.MAL_BASE_URL}/anime/${malId}?fields=title,main_picture,alternative_titles,synopsis,media_type,mean,rank,start_season,studios,genres`,
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
export async function fetchSearchMALAnime(q:string): Promise<MALAnime[] | null> {
    const res = await fetch(
    `${process.env.MAL_BASE_URL}/anime?q=${q}&limit=${reqLimit}&fields=title,main_picture,alternative_titles,media_type,start_season`,
    {
      headers: {
        "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID!,
      },
      next: { revalidate: 3600 },
    }
  ) 
  if (!res.ok) return null
  const json: MALSearchResponse = await res.json()

  return json.data?.map(item => item.node)
}
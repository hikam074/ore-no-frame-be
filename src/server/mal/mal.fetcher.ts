import { MALResponse } from "@/types"

export async function fetchMAL(
    source_type: string,
    malId: number
): Promise<MALResponse | null> {
    const res = await fetch(
        `${process.env.MAL_BASE_URL}/${source_type}/${malId}?fields=title,alternative_titles,main_picture,media_type,mean,rank,start_date,start_season,studios,genres`,
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
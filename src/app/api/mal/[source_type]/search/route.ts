import { jsonResWithCors } from "@/server/http/response"
import { mapMALtoSearchResult } from "@/server/utils"

import { MALApiResponse } from "@/types"

export const runtime = "edge"

const reqLimit = 5

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q")
    const sourceType = searchParams.get("source_type")

    if (!sourceType || !q || q.length < 1) {
        return jsonResWithCors(
            { error: "Source type invalid or Query parameter q is required/too short" },
            400
        )
    }

    try {
        const res = await fetch(
            `${process.env.MAL_BASE_URL}/${sourceType}?q=${q}&limit=${reqLimit}&fields=title,main_picture,alternative_titles,synopsis,media_type,mean,rank,start_season,studios,genres,start_date`,
            {
                headers: {
                    "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID!,
                },
                next: { revalidate: 3600 },
            }
        )
        if (!res.ok) {
            return jsonResWithCors({
                success: true,
                message: "None source can be found",
                data: []
            }, 200)
        }
        
        const json: MALApiResponse = await res.json()
        // console.log(json)

        const raw = json.data?.map(item => item.node) ?? []

        const data = raw.map(mapMALtoSearchResult)

        return jsonResWithCors({
            success: true,
            message: "Source retrieved successfully",
            data
        }, 200)

    } catch (error) {
        return jsonResWithCors({
            success: false,
            message: `Internal server error : ${error}`,
            data: null
        }, 500)
    }
}
import { getAnimeDetailData } from "@/server/anime/anime.service"
import { jsonResWithCors } from "@/server/http/response"

export const runtime = "edge"

export async function GET(
    req: Request,
    context: { params: Promise<{ mal_id: string }> }
) {
    const { mal_id } = await context.params
    const id = Number(mal_id)
    
    if (Number.isNaN(id)) {
        return jsonResWithCors({ 
            error: "Anime mal_id is invalid" 
        }, 400 )
    }

    const data = await getAnimeDetailData(id)
    if (!data) {
        return jsonResWithCors({ 
            success: false, 
            message: "Anime not found", 
            data: undefined 
        }, 404 )
    }

    return jsonResWithCors({
        success: true,
        message: 'Anime retrieved successfully',
        data: data
    }, 200)
}


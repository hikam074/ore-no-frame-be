import { NextResponse } from "next/server"
import { getAnimeDetailData } from "@/server/anime/anime.service"

export const runtime = "edge"

export async function GET(
    req: Request,
    context: { params: Promise<{ mal_id: string }> }
) {
    const { mal_id } = await context.params
    const id = Number(mal_id)
    
    if (Number.isNaN(id)) {
        return NextResponse.json(
            { success: false, message: "Anime mal_id is invalid", data: undefined },
            { status: 400 }
        )
    }

    const data = await getAnimeDetailData(id)
    if (!data) {
        return NextResponse.json({ success: false, message: "Anime not found", data: undefined }, { status: 404 })
    }

    return NextResponse.json({
        success: true,
        message: 'Anime retrieved successfully',
        data: data
    }, {
        status: 200
    })
}


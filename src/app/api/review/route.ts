import { NextResponse } from "next/server"
import { getAllReviews } from "@/server/review/review.repo"
import { jsonResWithCors } from "@/server/http/response"
import { optionResponse } from "@/server/http/options"
import { getUserFromRequest } from "@/server/utils/getUserFromToken"
import { postReview } from "@/server/anime/anime.service"
import { mapErrorToHttp } from "@/server/utils/mapErrorToHttp"

export const runtime = 'edge'
export async function OPTIONS() {
    return optionResponse()
}
// unused
export async function GET() {
    const data = await getAllReviews()
    return NextResponse.json({
        success: true,
        message: 'Reviews retrieved successfully',
        data: data.data
    }, {
        status: 200
    })
}
export async function POST(req: Request) {
    const user = await getUserFromRequest(req)

    if (!user) {
        return jsonResWithCors({
            success: false,
            message: "Unauthorized",
        }, 401)
    }

    const body = await req.json()
    const { mal_id, review } = body
    if (!mal_id || !review) {
        return jsonResWithCors({
            success: false,
            message: "Invalid payload"
        }, 422)
    }

    const result = await postReview({
        mal_id: mal_id,
        content: review,
        personal_score: null,
        published: true,
        reviewer_id: user.id,
    })

    if (!result.ok) {return mapErrorToHttp(result.error)}

    return jsonResWithCors({
        success: true,
        message: "Review created successfully",
        data: result.data
    }, 201)
}

import { NextResponse } from "next/server"
import { getAllReviews } from "@/server/review/review.repo"

export const runtime = 'edge'

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
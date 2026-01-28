import { NextResponse } from "next/server"
import { getAnimeSuggestions } from "@/server/anime/anime.repo"

export const runtime = "edge"

export async function GET() {
  const { data } = await getAnimeSuggestions()

  return NextResponse.json({
    success: true,
    message: 'Anime suggestions retrieved successfully',
    data: data ?? []
  }, {
    status: 200
  })
}

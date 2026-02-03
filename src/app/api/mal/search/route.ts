import { NextResponse } from "next/server"
// import { cookies } from "next/headers"

// sementara matikan cookies karena search tidak butuh acces key

export const runtime = "edge"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")

  if (!q) {
    return NextResponse.json(
      { error: "Query parameter q is required" },
      { status: 400 }
    )
  }

  // const cookieStore = cookies()
  // const accessToken = (await cookieStore).get("mal_access_token")?.value

  // if (!accessToken) {
  //   return NextResponse.json(
  //     { error: "Not authenticated with MAL" },
  //     { status: 401 }
  //   )
  // }

  const url =
    "https://api.myanimelist.net/v2/anime?" +
    new URLSearchParams({
      q,
      limit: "10",
      fields: "id,title,main_picture,media_type,start_season,mean,rank",
    })

  const res = await fetch(url, {
    headers: {
      // Authorization: `Bearer ${accessToken}`,
      'X-MAL-CLIENT-ID': `${process.env.MAL_CLIENT_ID}`,
    },
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status })
  }

  return NextResponse.json(data)
}
